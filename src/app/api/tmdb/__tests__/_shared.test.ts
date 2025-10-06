import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { posterUrl, yearFromReleaseDate, topCastFromCredits, requireId, getApiKey, HttpError } from '../_shared';

const originalEnv = { ...process.env };

beforeEach(() => {
  // Reset env to the original before each test
  process.env = { ...originalEnv } as any;
});

afterEach(() => {
  process.env = { ...originalEnv } as any;
});

describe('TMDB _shared utilities', () => {
  it('posterUrl builds URL when poster path provided', () => {
    expect(posterUrl('/abc.jpg', 'w185')).toBe('https://image.tmdb.org/t/p/w185/abc.jpg');
    expect(posterUrl('/xyz.png')).toBe('https://image.tmdb.org/t/p/w500/xyz.png');
  });

  it('posterUrl returns undefined for falsy/invalid input', () => {
    expect(posterUrl(undefined as any)).toBeUndefined();
    expect(posterUrl('' as any)).toBeUndefined();
    expect(posterUrl(123 as any)).toBeUndefined();
  });

  it('yearFromReleaseDate extracts year or returns undefined', () => {
    expect(yearFromReleaseDate('2010-07-16')).toBe(2010);
    expect(yearFromReleaseDate('1999')).toBe(1999);
    expect(yearFromReleaseDate('xx')).toBeUndefined();
    expect(yearFromReleaseDate(undefined as any)).toBeUndefined();
  });

  it('topCastFromCredits returns up to 3 names and filters falsy', () => {
    const credits = { cast: [ { name: 'A' }, { name: 'B' }, { name: 'C' }, { name: 'D' }, { name: undefined } ] };
    expect(topCastFromCredits(credits)).toEqual(['A','B','C']);
    expect(topCastFromCredits({ cast: [] })).toEqual([]);
    expect(topCastFromCredits(null as any)).toEqual([]);
  });

  it('requireId returns id from request URL', () => {
    const req = new Request('https://example.com/api?id=42');
    expect(requireId(req)).toBe('42');
  });

  it('requireId throws HttpError when missing', () => {
    const req = new Request('https://example.com/api');
    try {
      requireId(req);
      throw new Error('should have thrown');
    } catch (e: any) {
      expect(e).toBeInstanceOf(HttpError);
      expect((e as HttpError).status).toBe(400);
    }
  });

  it('getApiKey returns when env var is set', () => {
    process.env.TMDB_API_KEY = 'dummy';
    expect(getApiKey()).toBe('dummy');
  });

  it('getApiKey throws HttpError when env var is missing', () => {
    delete (process.env as any).TMDB_API_KEY;
    try {
      getApiKey();
      throw new Error('should have thrown');
    } catch (e: any) {
      expect(e).toBeInstanceOf(HttpError);
      expect((e as HttpError).status).toBe(500);
    }
  });
});
