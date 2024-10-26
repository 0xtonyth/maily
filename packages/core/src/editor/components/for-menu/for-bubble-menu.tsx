import { BubbleMenu } from '@tiptap/react';
import { useCallback } from 'react';
import { getRenderContainer } from '../../utils/get-render-container';
import { sticky } from 'tippy.js';
import { EditorBubbleMenuProps } from '../text-menu/text-bubble-menu';
import { isTextSelected } from '@/editor/utils/is-text-selected';
import { TooltipProvider } from '../ui/tooltip';
import { useForState } from './use-for-state';
import { Divider } from '../ui/divider';
import { Braces } from 'lucide-react';

export function ForBubbleMenu(props: EditorBubbleMenuProps) {
  const { appendTo, editor } = props;
  if (!editor) {
    return null;
  }

  const getReferenceClientRect = useCallback(() => {
    const renderContainer = getRenderContainer(editor!, 'for');
    const rect =
      renderContainer?.getBoundingClientRect() ||
      new DOMRect(-1000, -1000, 0, 0);

    return rect;
  }, [editor]);

  const bubbleMenuProps: EditorBubbleMenuProps = {
    ...props,
    ...(appendTo ? { appendTo: appendTo.current } : {}),
    shouldShow: ({ editor }) => {
      if (isTextSelected(editor)) {
        return false;
      }

      return editor.isActive('for');
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
      maxWidth: 'auto',
    },
    pluginKey: 'forBubbleMenu',
  };

  const state = useForState(editor);

  return (
    <BubbleMenu
      {...bubbleMenuProps}
      className="mly-flex mly-items-stretch mly-rounded-md mly-border mly-border-slate-200 mly-bg-white mly-p-0.5 mly-shadow-md"
    >
      <TooltipProvider>
        <span className="mly-flex mly-items-center mly-pl-1 mly-pr-0.5 mly-text-sm mly-leading-none">
          For
        </span>
        <Divider />
        <label className="mly-relative">
          <input
            value={state.each}
            onChange={(e) => {
              editor.commands.updateFor({
                each: e.target.value,
              });
            }}
            className="mly-h-7 mly-w-32 mly-rounded-md mly-px-2 mly-pr-6 mly-text-sm mly-text-midnight-gray hover:mly-bg-soft-gray focus:mly-bg-soft-gray focus:mly-outline-none"
          />
          <div className="mly-absolute mly-inset-y-0 mly-right-1 mly-flex mly-items-center">
            <Braces className="mly-h-3 mly-w-3 mly-stroke-[2.5] mly-text-midnight-gray" />
          </div>
        </label>
        <Divider />
      </TooltipProvider>
    </BubbleMenu>
  );
}
