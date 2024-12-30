import { groupSections } from './string';

const SEPARATOR = ' ';

describe('groupSections', () => {
  it('should group sections without exceeding the max size', () => {
    const sections = ['This', 'is', 'a', 'test', 'string'];
    const sectionMaxSize = 10;
    const expected = ['This is a', 'test', 'string'];
    expect(groupSections(sections, sectionMaxSize, SEPARATOR)).toEqual(
      expected,
    );
  });

  it('should handle sections that fit exactly into the max size', () => {
    const sections = ['This', 'is', 'a', 'test', 'string'];
    const sectionMaxSize = 14;
    const expected = ['This is a test', 'string'];
    expect(groupSections(sections, sectionMaxSize, SEPARATOR)).toEqual(
      expected,
    );
  });

  it('should handle sections larger than the max size', () => {
    const sections = ['This is a very long section that exceeds the max size'];
    const sectionMaxSize = 10;
    const expected = ['This is a very long section that exceeds the max size'];
    expect(groupSections(sections, sectionMaxSize, SEPARATOR)).toEqual(
      expected,
    );
  });

  it('should handle an empty array of sections', () => {
    const sections: string[] = [];
    const sectionMaxSize = 10;
    const expected: string[] = [];
    expect(groupSections(sections, sectionMaxSize, SEPARATOR)).toEqual(
      expected,
    );
  });

  it('should handle sections with varying lengths', () => {
    const sections = ['Short', 'and', 'long sections', 'mixed'];
    const sectionMaxSize = 15;
    const expected = ['Short and', 'long sections', 'mixed'];
    expect(groupSections(sections, sectionMaxSize, SEPARATOR)).toEqual(
      expected,
    );
  });
});
