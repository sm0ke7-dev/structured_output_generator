import { OutputGenerator, StructuredOutput } from '../src/index';

describe('OutputGenerator', () => {
  let generator: OutputGenerator;

  beforeEach(() => {
    // Reset the singleton instance for each test
    (OutputGenerator as any).instance = undefined;
    generator = OutputGenerator.getInstance();
  });

  describe('getInstance', () => {
    it('should return the same instance (singleton pattern)', () => {
      const instance1 = OutputGenerator.getInstance();
      const instance2 = OutputGenerator.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('generateOutput', () => {
    it('should generate output with correct structure', () => {
      const data = { name: 'Test', value: 123 };
      const metadata = { source: 'test' };
      
      const output = generator.generateOutput('test', data, metadata);

      expect(output).toMatchObject({
        type: 'test',
        data,
        metadata,
      });

      expect(output.id).toMatch(/^output_\d+$/);
      expect(output.timestamp).toBeInstanceOf(Date);
    });

    it('should increment counter for each generated output', () => {
      const output1 = generator.generateOutput('test1', {});
      const output2 = generator.generateOutput('test2', {});

      expect(output1.id).toBe('output_1');
      expect(output2.id).toBe('output_2');
    });

    it('should work without metadata', () => {
      const output = generator.generateOutput('test', { key: 'value' });

      expect(output.metadata).toBeUndefined();
      expect(output.data).toEqual({ key: 'value' });
    });
  });

  describe('getStats', () => {
    it('should return correct statistics', () => {
      expect(generator.getStats()).toEqual({ totalGenerated: 0 });

      generator.generateOutput('test1', {});
      expect(generator.getStats()).toEqual({ totalGenerated: 1 });

      generator.generateOutput('test2', {});
      expect(generator.getStats()).toEqual({ totalGenerated: 2 });
    });
  });
});

describe('StructuredOutput interface', () => {
  it('should allow valid structured output objects', () => {
    const output: StructuredOutput = {
      id: 'test_1',
      type: 'test',
      data: { key: 'value' },
      timestamp: new Date(),
      metadata: { source: 'test' },
    };

    expect(output.id).toBe('test_1');
    expect(output.type).toBe('test');
    expect(output.data).toEqual({ key: 'value' });
    expect(output.timestamp).toBeInstanceOf(Date);
    expect(output.metadata).toEqual({ source: 'test' });
  });

  it('should work without optional metadata', () => {
    const output: StructuredOutput = {
      id: 'test_2',
      type: 'test',
      data: { key: 'value' },
      timestamp: new Date(),
    };

    expect(output.metadata).toBeUndefined();
  });
}); 