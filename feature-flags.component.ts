import {
  Component,
  HostListener,
  Input,
  OnInit
} from '@angular/core';
import { FeatureFlagsService } from './feature-flags.service';

@Component({
  selector: 'feature-flags',
  templateUrl: 'feature-flags.component.html',
  styleUrls: [ 'feature-flags.component.css' ]
})
export class FeatureFlagsComponent implements OnInit {

  keysCache: Array<number> = [];
  @Input() code: Array<number> = [70, 69, 65, 84];
  @Input() features: Array<string> = [];
  private isVisible: boolean = false;

  constructor(private featureFlagsService: FeatureFlagsService) {}

  ngOnInit() {
    this.features
      .forEach(feature =>
        this.featureFlagsService.setFeature(feature,
          this.featureFlagsService.getFeatureStatus(feature) || false)
        );
  }

  compareArray(a1, a2): boolean {
    if (a1.length !== a2.length) return false;
    for (var i = 0; i < a1.length; i++) {
        if (a1[i] !== a2[i]) return false;
    }
    return true;
  }

  updateFlag(feature: string): void {
    this.featureFlagsService.setFeature(feature,
      !this.featureFlagsService.getFeatureStatus(feature));
  }

  @HostListener('document: keyup', ['$event.keyCode'])
  handleKeyUp(keyCode: number): void {
    if (this.code.length > this.keysCache.push(keyCode)) {
      return;
    }
    if (this.code.length < this.keysCache.length) {
      this.keysCache.shift();
    }
    if (this.compareArray(this.code, this.keysCache)) {
      this.isVisible = !this.isVisible;
    }
  }

  closeModal(): void {
    this.isVisible = false;
  }
}
