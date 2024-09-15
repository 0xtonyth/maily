import { BubbleMenu, isTextSelection } from '@tiptap/react';
import { EditorBubbleMenuProps } from './../editor-bubble-menu';
import { useCallback } from 'react';
import { getRenderContainer } from '../../utils/get-render-container';
import { sticky } from 'tippy.js';
import { useSectionState } from './use-section-state';
import { NumberInput } from '../ui/number-input';
import { Box, Scan } from 'lucide-react';

export function SectionBubbleMenu(props: EditorBubbleMenuProps) {
  const { appendTo, editor } = props;
  if (!editor) {
    return null;
  }

  const getReferenceClientRect = useCallback(() => {
    const renderContainer = getRenderContainer(editor!, 'section');
    const rect =
      renderContainer?.getBoundingClientRect() ||
      new DOMRect(-1000, -1000, 0, 0);

    return rect;
  }, [editor]);

  const bubbleMenuProps: EditorBubbleMenuProps = {
    ...props,
    ...(appendTo ? { appendTo: appendTo.current } : {}),
    shouldShow: ({ editor, state, from, to }) => {
      const { doc, selection } = state;
      const { empty } = selection;

      // Sometime check for `empty` is not enough.
      // Doubleclick an empty paragraph returns a node size of 2.
      // So we check also for an empty text size.
      const isEmptyTextBlock =
        !doc.textBetween(from, to).length && isTextSelection(state.selection);
      if (!isEmptyTextBlock) {
        return false;
      }

      return editor.isActive('section');
    },
    tippyOptions: {
      offset: [0, 8],
      popperOptions: {
        modifiers: [{ name: 'flip', enabled: false }],
      },
      getReferenceClientRect,
      appendTo: () => appendTo?.current,
      plugins: [sticky],
      sticky: 'popper',
    },
    pluginKey: 'sectionBubbleMenu',
  };

  const state = useSectionState(editor);

  return (
    <BubbleMenu
      {...bubbleMenuProps}
      className="mly-flex mly-items-stretch mly-rounded-md mly-border mly-border-slate-200 mly-bg-white mly-p-1 mly-shadow-md"
    >
      <NumberInput
        icon={Scan}
        value={state.currentBorderRadius}
        onValueChange={(value) => {
          editor?.commands?.updateAttributes('section', {
            borderRadius: value,
          });
        }}
      />
      <div className="mly-mx-0.5 mly-w-px mly-bg-gray-200" />
      <NumberInput
        icon={Box}
        value={state.currentPadding}
        onValueChange={(value) => {
          editor?.commands?.updateAttributes('section', {
            padding: value,
          });
        }}
      />
    </BubbleMenu>
  );
}
