import { Editor } from '@tiptap/react';
import { Fragment, Node } from '@tiptap/pm/model';
import { TextSelection } from '@tiptap/pm/state';
import { v4 as uuid } from 'uuid';
import { findParentNode } from '@tiptap/core';

export function getColumnCount(editor: Editor) {
  return getClosestNodeByName(editor, 'columns')?.node?.childCount || 0;
}

export function getClosestNodeByName(editor: Editor, name: string) {
  const { state } = editor.view;
  return findParentNode((node) => node.type.name === name)(state.selection);
}

export function addColumn(editor: Editor) {
  const { node: columnsNode, pos: columnsNodePos = 0 } =
    getClosestNodeByName(editor, 'columns') || {};
  if (!columnsNode) {
    return;
  }

  const { node: activeColumnNode, pos: activeColumnNodePos = 0 } =
    getClosestNodeByName(editor, 'column') || {};
  if (!activeColumnNode) {
    return;
  }

  const { state, dispatch } = editor.view;
  const { tr } = state;
  // Get the current columns node position and add the columns size
  // to the end of the columns node
  const calculatedWidth = +Number(100 / (columnsNode.childCount + 1)).toFixed(
    2
  );
  const newColumn = state.schema.nodes.column.create(
    {
      width: calculatedWidth,
      columnId: uuid(),
    },
    state.schema.nodes.paragraph.create(null)
  );

  let updatedContent: Node[] = [];
  let activeColumnIndex = 0;
  columnsNode.content.forEach((child, _, index) => {
    if (
      child.eq(activeColumnNode) &&
      child?.attrs?.columnId === activeColumnNode?.attrs?.columnId
    ) {
      activeColumnIndex = index;
    }

    updatedContent.push(
      child.type.create(
        {
          ...child?.attrs,
          width: calculatedWidth,
        },
        child.content
      )
    );
  });

  updatedContent.splice(activeColumnIndex + 1, 0, newColumn);
  const newColumnPos =
    columnsNodePos +
    updatedContent
      .slice(0, activeColumnIndex + 1)
      .reduce((acc, node) => acc + node.nodeSize, 0);

  const updatedColumnsNode = columnsNode.copy(Fragment.from(updatedContent));

  const transaction = tr.replaceWith(
    columnsNodePos,
    columnsNodePos + columnsNode.nodeSize,
    updatedColumnsNode
  );

  // Calculate the position of the new column by adding the new column's position
  const textSelection = TextSelection.near(
    transaction.doc.resolve(newColumnPos)
  );
  transaction.setSelection(textSelection);

  dispatch(transaction);
  editor.view.focus();
}

export function removeColumn(editor: Editor) {
  const { node: columnsNode, pos: columnsNodePos = 0 } =
    getClosestNodeByName(editor, 'columns') || {};
  if (!columnsNode) {
    return;
  }

  const { node: activeColumnNode, pos: activeColumnNodePos = 0 } =
    getClosestNodeByName(editor, 'column') || {};
  if (!activeColumnNode) {
    return;
  }

  const { state, dispatch } = editor.view;
  const { tr } = state;

  const calculatedWidth = +Number(100 / (columnsNode.childCount - 1)).toFixed(
    2
  );

  let updatedContent: Node[] = [];
  let activeColumnIndex = 0;
  let isRemoved = false;
  columnsNode.content.forEach((child, _, index) => {
    const isActiveColumn =
      child.eq(activeColumnNode) &&
      child?.attrs?.columnId === activeColumnNode?.attrs?.columnId;
    if (isActiveColumn && !isRemoved) {
      activeColumnIndex = index;
      isRemoved = true;
      return;
    }

    updatedContent.push(
      child.type.create(
        {
          ...child?.attrs,
          width: calculatedWidth,
        },
        child.content
      )
    );
  });

  const isLastColumn = activeColumnIndex === columnsNode.childCount - 1;

  const newColumnPos =
    columnsNodePos +
    updatedContent
      .slice(0, isLastColumn ? activeColumnIndex - 1 : activeColumnIndex)
      .reduce((acc, node) => acc + node.nodeSize, 0);

  const updatedColumnsNode = columnsNode.copy(Fragment.from(updatedContent));

  const transaction = tr.replaceWith(
    columnsNodePos,
    columnsNodePos + columnsNode.nodeSize,
    updatedColumnsNode
  );

  // Calculate the position of the new column by adding the new column's position
  const textSelection = TextSelection.near(
    transaction.doc.resolve(newColumnPos)
  );
  transaction.setSelection(textSelection);

  dispatch(transaction);
  editor.view.focus();
}

export function goToColumn(editor: Editor, type: 'next' | 'previous') {
  const columnsNode = getClosestNodeByName(editor, 'columns');
  const columnNode = getClosestNodeByName(editor, 'column');
  if (!columnsNode || !columnNode) {
    return false;
  }

  const { state, dispatch } = editor.view;
  // Get the current columns node position and add the columns size
  // to the end of the columns node
  const cols = columnsNode.node;
  let currColumnIndex = 0;
  cols.content.forEach((child, _, index) => {
    if (
      child.eq(columnNode.node) &&
      child?.attrs?.columnId === columnNode.node?.attrs?.columnId
    ) {
      currColumnIndex = index;
    }
  });

  const nextColumnIndex =
    type === 'next' ? currColumnIndex + 1 : currColumnIndex - 1;
  // if the next column index is out of bounds, return
  if (nextColumnIndex < 0 || nextColumnIndex >= cols.childCount) {
    return false;
  }

  let nextColumnPos = columnsNode.pos;
  cols.content.forEach((child, _, index) => {
    if (index < nextColumnIndex) {
      nextColumnPos += child.nodeSize;
    }
  });

  const tr = state.tr.setTime(Date.now());
  const textSelection = TextSelection.near(tr.doc.resolve(nextColumnPos));
  tr.setSelection(textSelection);

  dispatch(tr);
  return true;
}
