
// Test suite for slot router functionality
describe('SlotRouter', () => {

  let router;
  
  beforeEach(() => {
    router = new SlotRouter();
  });

  describe('addRoute', () => {
    it('should add a new route', () => {
      const handler = () => {};
      router.addRoute('test', handler);
      expect(router.routes.test).toBe(handler);
    });
  });

  describe('removeRoute', () => {
    it('should remove an existing route', () => {
      const handler = () => {};
      router.addRoute('test', handler);
      router.removeRoute('test');
      expect(router.routes.test).toBeUndefined();
    });
  });

  describe('hasRoute', () => {
    it('should return true for existing route', () => {
      router.addRoute('test', () => {});
      expect(router.hasRoute('test')).toBe(true);
    });

    it('should return false for non-existing route', () => {
      expect(router.hasRoute('nonexistent')).toBe(false);
    });
  });

  describe('execute', () => {
    it('should execute the correct route handler', () => {
      const mockHandler = jest.fn();
      router.addRoute('test', mockHandler);
      
      router.execute('test', {data: 'test'});
      expect(mockHandler).toHaveBeenCalledWith({data: 'test'});
    });

    it('should throw error for non-existing route', () => {
      expect(() => {
        router.execute('nonexistent');
      }).toThrow('Route not found: nonexistent');
    });
  });

  describe('clear', () => {
    it('should remove all routes', () => {
      router.addRoute('test1', () => {});
      router.addRoute('test2', () => {});
      
      router.clear();
      expect(router.routes).toEqual({});
    });
  });

});