const middy: any = jest.createMockFromModule('@middy/core');
middy.mockImplementation((handler) => {
  return {
    use: jest.fn().mockReturnValue(handler),
  };
});
module.exports = middy;
