import {
  HeadingNode,
  HeadingTagType,
  SerializedHeadingNode,
} from '@lexical/rich-text';
import { DOMExportOutput, EditorConfig, LexicalEditor, NodeKey } from 'lexical';
import theme from '../../editor-theme/DefaultTheme';
export class CustomHeadingNode extends HeadingNode {
    constructor(tag: HeadingTagType, key?: NodeKey) {
      super(tag, key);
    }
  
    static getType(): string {
      return 'custom-heading';
    }
  
    static clone(node: CustomHeadingNode): CustomHeadingNode {
      return new CustomHeadingNode(node.getTag(), node.__key);
    }
  
    createDOM(config: EditorConfig): HTMLElement {
      const dom = super.createDOM(config);
      const headingText = this.getTextContent();
      dom.id = headingText.replace(/\s+/g, '-').toLowerCase(); 
  
      const tag = this.getTag();
      const headingClass = theme.heading?.[tag];
      if (headingClass) {
        dom.className = headingClass;
      }
  
      return dom;
    }
  
  
    updateDOM(prevNode: CustomHeadingNode, dom: HTMLElement): boolean {
      const updated = super.updateDOM(prevNode, dom);
      const headingText = this.getTextContent();
      dom.id = headingText.replace(/\s+/g, '-').toLowerCase(); 
  
      const tag = this.getTag();
      const headingClass = theme.heading?.[tag];
      if (headingClass) {
        dom.className = headingClass;
      }
  
      return updated;
    }
  
    exportJSON(): SerializedHeadingNode {
      return {
        ...super.exportJSON(),
        type: 'custom-heading',
      };
    }
  
    static importJSON(serializedNode: SerializedHeadingNode): CustomHeadingNode {
      const node = $createCustomHeadingNode(serializedNode.tag);
      return node;
    }
    exportDOM(editor: LexicalEditor): DOMExportOutput {
      const element = document.createElement(this.getTag());
      const headingText = this.getTextContent(); 
      const dir = this.getDirection();
    
      element.id = headingText.replace(/\s+/g, '-').toLowerCase();
    
      const tag = this.getTag();
      const headingClass = theme.heading?.[tag];
      if (headingClass) {
        element.className = `${headingClass} ${theme.ltr}`;
      }
  
      if (dir) {
        element.setAttribute('dir', dir);
      }
    
      const spanElement = document.createElement('span');
      spanElement.setAttribute('data-lexical-text', 'true');
      spanElement.textContent = headingText; 
    
      while (element.firstChild) {
        element.removeChild(element.firstChild);
      }
    
      return { element };
    }
    
    
    
    
  }
  
  export function $createCustomHeadingNode(tag: HeadingTagType): CustomHeadingNode {
    return new CustomHeadingNode(tag);
  }