import { FilterPipe } from './filter.pipe';

describe('FilterPipe', () => {
  let pipe: FilterPipe;

  beforeEach(() => {
    pipe = new FilterPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should filter values based on fullName', () => {
    const values = [
      { albumOwnerName: 'Owner 1' },
      { albumOwnerName: 'Owner 2' },
      { albumOwnerName: 'Owner 1' },
      { albumOwnerName: 'Owner 3' }
    ];
    expect(pipe.transform(values, 'Owner 1')).toEqual([{ albumOwnerName: 'Owner 1' }, { albumOwnerName: 'Owner 1' }]);
    expect(pipe.transform(values, 'Owner 2')).toEqual([{ albumOwnerName: 'Owner 2' }]);
    expect(pipe.transform(values, 'Owner 4')).toEqual([]);
  });
});