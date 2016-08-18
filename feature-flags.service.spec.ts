import {
  it,
  inject,
  describe,
  beforeEachProviders,
  beforeEach
} from '@angular/core/testing';

import { FeatureFlagsService } from './feature-flags.service';

describe('FeatureFlagsService', () => {
  let subject;
  const name = 'foo';

  beforeEachProviders(() => [
    FeatureFlagsService
  ]);

  beforeEach(inject([FeatureFlagsService], (service: FeatureFlagsService) => {
    localStorage.clear();
    subject = service;
    subject._features = {};
  }));

  it('should load from local storage', () => {
    localStorage.setItem(name, 'false');
    localStorage.setItem('feature-flag-bar', 'true');
    localStorage.setItem('feature-flag-baz', 'true');

    let localStorageGetItem = spyOn(localStorage, 'getItem');
    subject.loadLocalStorage();

    expect(localStorageGetItem.calls.count())
      .toEqual(2);
    expect(Object.keys(subject._features).length).toBe(2);
  });

  it('should coerce string values into booleans', () => {
    localStorage.setItem('feature-flag-bar', 'true');
    subject.loadLocalStorage();

    expect(subject.getFeatureStatus('bar')).toBe(true);
  });

  it('should treat undefined flags as not enabled', () => {
    expect(subject.getFeatureStatus('spaghetti')).toBe(false);
  });

  it('should not load localStorage keys outside of it\'s namespace', () => {
    localStorage.setItem(name, 'false');
    localStorage.setItem('feature-flag-bar', 'true');

    let localStorageGetItem = spyOn(localStorage, 'getItem');
    subject.loadLocalStorage();

    expect(localStorageGetItem.calls.count())
      .toEqual(1);
    expect(Object.keys(subject._features).length).toBe(1);
    expect(subject._features[name]).toBeUndefined();
  });

  it('should set the feature flag in localStorage', () => {
    spyOn(localStorage, 'setItem');
    subject.setFeature(name, true);

    expect(subject._features[name]).toBe(true);
    expect(localStorage.setItem)
      .toHaveBeenCalledWith(`feature-flag-${name}`, true);
  });

  it('should remove an item in localStorage', () => {
    spyOn(localStorage, 'removeItem');
    subject.removeFeature(name);

    expect(localStorage.removeItem)
      .toHaveBeenCalledWith(`feature-flag-${name}`);
    expect(subject._features[name]).toBeUndefined();
  });

  it('should return a feature flag status', () => {
    subject._features[name] = true;

    expect(subject.getFeatureStatus(name)).toBe(true);
  });

  it('should serialize the feature object', () => {
    subject._features[name] = true;
    subject._features['bar'] = false;
    subject._features['baz'] = true;
    let localStorageSetItem = spyOn(localStorage, 'setItem');

    subject.serialize();

    expect(localStorageSetItem.calls.count()).toEqual(3);
  });
});
