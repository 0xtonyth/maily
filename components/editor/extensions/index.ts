import { InputRule } from "@tiptap/core";

import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import Heading from '@tiptap/extension-heading'
import TextAlign from '@tiptap/extension-text-align'
import Paragraph from '@tiptap/extension-paragraph'
import Document from '@tiptap/extension-document'
import Text from '@tiptap/extension-text'
import Bold from '@tiptap/extension-bold'
import Italic from '@tiptap/extension-italic'
import Strike from '@tiptap/extension-strike'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import Image from '@tiptap/extension-image'
import Dropcursor from '@tiptap/extension-dropcursor'
import Underline from '@tiptap/extension-underline'
import { History } from '@tiptap/extension-history'
import Placeholder from '@tiptap/extension-placeholder'
import Gapcursor from '@tiptap/extension-gapcursor'
import HardBreak from "@tiptap/extension-hard-break";
import { TiptapLogoExtension } from "./logo";
import { Spacer } from "../nodes/spacer";
import { Footer } from "../nodes/footer";
import { Variable } from "../nodes/variable";
import { suggestions } from "../nodes/suggestion";
import { SuggestionOptions } from "@tiptap/suggestion";

export const TiptapExtensions = [
  Document,
  Paragraph,
  Text,
  Bold,
  Italic,
  Strike,
  Underline,
  BulletList,
  OrderedList,
  ListItem,
  Image,
  TiptapLogoExtension,
  Dropcursor.configure({
    color: "#555",
    width: 3
  }),
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle.configure(),
  TextAlign.configure({ types: [Paragraph.name, Heading.name] }),
  Heading.extend({
    levels: [1, 2, 3],
  }),
  // patch to fix horizontal rule bug: https://github.com/ueberdosis/tiptap/pull/3859#issuecomment-1536799740
  HorizontalRule.extend({
    addInputRules() {
      return [
        new InputRule({
          find: /^(?:---|—-|___\s|\*\*\*\s)$/,
          handler: ({ state, range }) => {
            const attributes = {};

            const { tr } = state;
            const start = range.from;
            let end = range.to;

            tr.insert(start - 1, this.type.create(attributes)).delete(
              tr.mapping.map(start),
              tr.mapping.map(end),
            );
          },
        }),
      ];
    },
  }),
  Placeholder.configure({
    placeholder: ({ node }) => {
      if (node.type.name === "heading") {
        return `Heading ${node.attrs.level}`;
      }
      return "Write something...";
    },
    includeChildren: true,
  }),
  History,
  Spacer,
  Gapcursor,
  HardBreak,
  Footer,
  Variable.configure({
    suggestion: suggestions as unknown as SuggestionOptions,
    renderLabel({ node }) {
      return `${node.attrs.label ?? node.attrs.id}`
    },
    HTMLAttributes: {
      class: 'py-1 px-2 bg-slate-100 border border-blue-300 rounded-md'
    }
  })
];
