import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { ForView } from './for-view';
import { updateAttributes } from '@/editor/utils/update-attribute';

type ForAttributes = {
  each: string;
  isUpdatingKey: boolean;
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    for: {
      setFor: () => ReturnType;
      updateFor: (attrs: Partial<ForAttributes>) => ReturnType;
    };
  }
}

export const ForExtension = Node.create({
  name: 'for',
  group: 'block',
  content: '(block|columns)+',
  draggable: true,
  isolating: true,

  addAttributes() {
    return {
      each: {
        default: 'items',
        parseHTML: (element) => {
          return element.getAttribute('each') || '';
        },
        renderHTML: (attributes) => {
          if (!attributes.each) {
            return {};
          }

          return {
            each: attributes.each,
          };
        },
      },
      isUpdatingKey: {
        default: false,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: `div[data-type="${this.name}"]`,
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-type': this.name,
      }),
      0,
    ];
  },

  addCommands() {
    return {
      setFor:
        () =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {},
            content: [
              {
                type: 'paragraph',
              },
            ],
          });
        },
      updateFor: (attrs) => updateAttributes(this.name, attrs),
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ForView, {
      contentDOMElementTag: 'div',
    });
  },
});
