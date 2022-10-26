<template>
    <div>
      <template v-for="(item, index) in items">
        <div class="divider" v-if="item.type === 'divider'" :key="`divider${index}`"></div>
        <component :is="item.icon"  v-else :key="index"></component>
      </template>
    </div>
  </template>
  
  <script>
  
  export default {
  
    props: {
      editor: {
        type: Object,
        required: true,
      },
    },
  
    data() {
      return {
        items: [
          {
            icon: 'icon-bold',
            title: 'Bold',
            action: () => this.editor.chain().focus().toggleBold().run(),
            isActive: () => this.editor.isActive('bold'),
          },
          {
            icon: 'icon-italic',
            title: 'Italic',
            action: () => this.editor.chain().focus().toggleItalic().run(),
            isActive: () => this.editor.isActive('italic'),
          },
          {
            icon: 'icon-strikethrough',
            title: 'Strike',
            action: () => this.editor.chain().focus().toggleStrike().run(),
            isActive: () => this.editor.isActive('strike'),
          },
          {
            icon: 'icon-code-block',
            title: 'Code',
            action: () => this.editor.chain().focus().toggleCode().run(),
            isActive: () => this.editor.isActive('code'),
          },
          {
            icon: 'icon-font-colors',
            title: 'Highlight',
            action: () => this.editor.chain().focus().toggleHighlight().run(),
            isActive: () => this.editor.isActive('highlight'),
          },
          {
            type: 'divider',
          },
          {
            icon: 'icon-h1',
            title: 'Heading 1',
            action: () => this.editor.chain().focus().toggleHeading({ level: 1 }).run(),
            isActive: () => this.editor.isActive('heading', { level: 1 }),
          },
          {
            icon: 'icon-h2',
            title: 'Heading 2',
            action: () => this.editor.chain().focus().toggleHeading({ level: 2 }).run(),
            isActive: () => this.editor.isActive('heading', { level: 2 }),
          },
        ],
      }
    },
  }
  </script>
  
  <style lang="less" scoped>
  .divider {
    width: 2px;
    height: 1.25rem;
    background-color: rgba(#000, 0.1);
    margin-left: 0.5rem;
    margin-right: 0.75rem;
  }
  </style>