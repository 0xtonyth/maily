import { BubbleMenu, isTextSelection } from '@tiptap/react';
import { useCallback } from 'react';
import { getRenderContainer } from '../../utils/get-render-container';
import { sticky } from 'tippy.js';
import { useSectionState } from './use-section-state';
import { NumberInput } from '../ui/number-input';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Box,
  BoxSelect,
  Scan,
} from 'lucide-react';
import { ColorPicker } from '../ui/color-picker';
import { EditorBubbleMenuProps } from '../text-menu/text-bubble-menu';
import { isTextSelected } from '@/editor/utils/is-text-selected';
import { Divider } from '../ui/divider';
import { BubbleMenuButton } from '../bubble-menu-button';
import { GridLines } from '../icons/grid-lines';
import { EdgeSpacingControl } from '../ui/edge-spacing-controls';
import { TooltipProvider } from '../ui/tooltip';

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
    shouldShow: ({ editor }) => {
      if (isTextSelected(editor)) {
        return false;
      }

      return (
        editor.isActive('section') &&
        !editor.isActive('columns') &&
        !editor.isActive('column')
      );
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
    pluginKey: 'sectionBubbleMenu',
  };

  const state = useSectionState(editor);

  const isAllPaddingEqual =
    state.currentPaddingTop === state.currentPaddingRight &&
    state.currentPaddingTop === state.currentPaddingBottom &&
    state.currentPaddingTop === state.currentPaddingLeft;

  const isAllMarginEqual =
    state.currentMarginTop === state.currentMarginRight &&
    state.currentMarginTop === state.currentMarginBottom &&
    state.currentMarginTop === state.currentMarginLeft;

  return (
    <BubbleMenu
      {...bubbleMenuProps}
      className="mly-flex mly-items-stretch mly-rounded-md mly-border mly-border-slate-200 mly-bg-white mly-p-1 mly-shadow-md"
    >
      <TooltipProvider>
        <NumberInput
          icon={Scan}
          value={state.currentBorderRadius}
          onValueChange={(value) => {
            editor?.commands?.updateSection({
              borderRadius: value,
            });
          }}
          tooltip="Border Radius"
        />

        <NumberInput
          max={8}
          icon={BoxSelect}
          value={state.currentBorderWidth}
          onValueChange={(value) => {
            editor?.commands?.updateSection({
              borderWidth: value,
            });
          }}
          tooltip="Border Width"
        />

        <ColorPicker
          color={state.currentBorderColor}
          onColorChange={(color) => {
            editor?.commands?.updateSection({
              borderColor: color,
            });
          }}
          borderColor={state.currentBorderColor}
          backgroundColor="transparent"
          tooltip="Border Color"
          className="mly-shadow"
        />

        <Divider />

        <NumberInput
          icon={Box}
          value={isAllPaddingEqual ? state.currentPaddingTop : 0}
          onValueChange={(value) => {
            editor?.commands?.updateSection({
              paddingTop: value,
              paddingRight: value,
              paddingBottom: value,
              paddingLeft: value,
            });
          }}
          tooltip="Padding"
        />

        <EdgeSpacingControl
          top={state.currentPaddingTop}
          right={state.currentPaddingRight}
          bottom={state.currentPaddingBottom}
          left={state.currentPaddingLeft}
          onTopValueChange={(value) => {
            editor?.commands?.updateSection({
              paddingTop: value,
            });
          }}
          onRightValueChange={(value) => {
            editor?.commands?.updateSection({
              paddingRight: value,
            });
          }}
          onBottomValueChange={(value) => {
            editor?.commands?.updateSection({
              paddingBottom: value,
            });
          }}
          onLeftValueChange={(value) => {
            editor?.commands?.updateSection({
              paddingLeft: value,
            });
          }}
        />

        <Divider />

        <NumberInput
          icon={GridLines}
          value={isAllMarginEqual ? state.currentMarginTop : 0}
          onValueChange={(value) => {
            editor?.commands?.updateSection({
              marginTop: value,
              marginRight: value,
              marginBottom: value,
              marginLeft: value,
            });
          }}
          tooltip="Margin"
        />

        <EdgeSpacingControl
          top={state.currentMarginTop}
          right={state.currentMarginRight}
          bottom={state.currentMarginBottom}
          left={state.currentMarginLeft}
          onTopValueChange={(value) => {
            editor?.commands?.updateSection({
              marginTop: value,
            });
          }}
          onRightValueChange={(value) => {
            editor?.commands?.updateSection({
              marginRight: value,
            });
          }}
          onBottomValueChange={(value) => {
            editor?.commands?.updateSection({
              marginBottom: value,
            });
          }}
          onLeftValueChange={(value) => {
            editor?.commands?.updateSection({
              marginLeft: value,
            });
          }}
        />

        <Divider />

        <ColorPicker
          color={state.currentBackgroundColor}
          onColorChange={(color) => {
            editor?.commands?.updateSection({
              backgroundColor: color,
            });
          }}
          backgroundColor={state.currentBackgroundColor}
          tooltip="Background Color"
          className="mly-border-[1px]"
        />

        <Divider />

        <BubbleMenuButton
          name="Align Left"
          isActive={() => state.isAlignLeft}
          className="!mly-h-7 mly-w-7 mly-shrink-0 mly-p-0"
          iconClassName="mly-w-3 mly-h-3"
          icon={AlignLeft}
          command={() => editor.commands.updateSection({ align: 'left' })}
          tooltip="Align Left"
        />
        <BubbleMenuButton
          name="Align Center"
          isActive={() => state.isAlignCenter}
          className="!mly-h-7 mly-w-7 mly-shrink-0 mly-p-0"
          iconClassName="mly-w-3 mly-h-3"
          icon={AlignCenter}
          command={() => editor.commands.updateSection({ align: 'center' })}
          tooltip="Align Center"
        />
        <BubbleMenuButton
          name="Align Right"
          isActive={() => state.isAlignRight}
          className="!mly-h-7 mly-w-7 mly-shrink-0 mly-p-0"
          iconClassName="mly-w-3 mly-h-3"
          icon={AlignRight}
          command={() => editor.commands.updateSection({ align: 'right' })}
          tooltip="Align Right"
        />
      </TooltipProvider>
    </BubbleMenu>
  );
}
