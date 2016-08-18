import {
  it,
  inject,
  async,
  describe,
  beforeEachProviders,
  beforeEach
} from '@angular/core/testing';
import { TestComponentBuilder, ComponentFixture } from '@angular/compiler/testing';
import { FeatureFlagsComponent } from './feature-flags.component';
import { FeatureFlagsService } from './feature-flags.service';

function keyPress(keycode: number) {
  var event: Event;
  event = document.createEvent('Event');
  event.initEvent('keyup', true, true);

  // Hack DOM Level 3 Events "key" prop into keyboard event.
  // From: http://marcysutton.github.io/a11y-testing-angular2/#/11
  Object.defineProperty(event, 'keyCode', {
    value: keycode,
    enumerable: false,
    writable: false,
    configurable: true
  });

  document.dispatchEvent(event);
}

describe('FeatureFlags', () => {
  beforeEachProviders(() => [
    TestComponentBuilder,
    FeatureFlagsComponent,
    FeatureFlagsService
  ]);

  beforeEach(async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
    return tcb.createAsync(FeatureFlagsComponent)
      .then((componentFixture: ComponentFixture<FeatureFlagsComponent>) => {
        this.fixture = componentFixture;
      });
  })));

  describe('when not activated', () => {
    beforeEach(() => {
      this.component = this.fixture.componentInstance;
      this.component.isVisible = false;
    });

    it('should activate when key combo is entered', (done: () => void) => {
      this.fixture.detectChanges();
      keyPress(70); // 'f'
      keyPress(69); // 'e'
      keyPress(65); // 'a'
      keyPress(84); // 't'
      expect(this.component.isVisible).toBe(true);
      done();
    });
  });

  describe('when activated', () => {
    beforeEach(() => {
      this.component = this.fixture.componentInstance;
      this.element = this.fixture.nativeElement;
      this.component.isVisible = true;
    });

    it('should de-activate when key combo is entered', (done: () => void) => {
      this.fixture.detectChanges();
      keyPress(70); // 'f'
      keyPress(69); // 'e'
      keyPress(65); // 'a'
      keyPress(84); // 't'
      expect(this.component.isVisible).toBe(false);
      done();
    });

    it('should de-activate when "x" is clicked', (done: () => void) => {
      this.fixture.detectChanges();
      this.element.querySelector('.close').click();
      expect(this.component.isVisible).toBe(false);
      done();
    });

    it('should de-activate when "Cancel" button is clicked', (done: () => void) => {
      this.fixture.detectChanges();
      this.element.querySelector('#cancel-button').click();
      expect(this.component.isVisible).toBe(false);
      done();
    });

    it('should set feature flag when its name clicked', (done: () => void) => {
      spyOn(this.component, 'updateFlag');
      this.component.features = ['foo'];
      this.fixture.detectChanges();
      this.element.querySelector('.features .title-desc').click();
      expect(this.component.updateFlag).toHaveBeenCalledWith('foo');
      done();
    });

    it('should set feature flag when its slider toggled', (done: () => void) => {
      spyOn(this.component, 'updateFlag');
      this.component.features = ['foo'];
      this.fixture.detectChanges();
      this.element.querySelector('.features .onoffswitch-label').click();
      expect(this.component.updateFlag).toHaveBeenCalledWith('foo');
      done();
    });
  });
});
