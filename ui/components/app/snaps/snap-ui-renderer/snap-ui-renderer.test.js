import { JSXElementStruct } from '@metamask/snaps-sdk/jsx';
import { COMPONENT_MAPPING } from './components';

const EXCLUDED_COMPONENTS = ['Option'];

describe('Snap UI mapping', () => {
  it('supports all exposed components', () => {
    const elements = JSXElementStruct.schema
      .map((struct) => JSON.parse(struct.schema.type.type))
      .filter((key) => !EXCLUDED_COMPONENTS.includes(key));
    expect(Object.keys(COMPONENT_MAPPING).sort()).toStrictEqual(
      elements.sort(),
    );
  });
});
