import config_validation from '../app/core/config_validation.js';
import language_load from '../app/core/language.js';

describe('#validateConfig()', () => {
  it('throws when secret is missing', () => {
    expect(() => config_validation({})).toThrow(
      'Config secret needs a value at least 16 characters',
    );
  });

  it('throws when secret is empty string', () => {
    expect(() => config_validation({ secret: '' })).toThrow(
      'Config secret needs a value at least 16 characters',
    );
  });

  it('throws when secret is too short', () => {
    expect(() => config_validation({ secret: 'short' })).toThrow(
      'Config secret needs a value at least 16 characters',
    );
  });

  it('does not throw for valid secret', () => {
    expect(() =>
      config_validation({ secret: 'a-valid-secret-1234' }),
    ).not.toThrow();
  });
});

describe('#language_load()', () => {
  it('loads English translations', () => {
    const lang = language_load('en');
    expect(lang).toHaveProperty('home');
    expect(lang).toHaveProperty('search');
  });

  it('loads Russian translations', () => {
    const lang = language_load('ru');
    expect(lang).toHaveProperty('home');
  });

  it('throws for nonexistent locale', () => {
    expect(() => language_load('nonexistent')).toThrow();
  });
});
