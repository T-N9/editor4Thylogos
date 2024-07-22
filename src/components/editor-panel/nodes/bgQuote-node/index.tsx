import { $applyNodeReplacement, $createParagraphNode, DOMConversionMap, DOMConversionOutput, DOMExportOutput, EditorConfig, ElementFormatType, ElementNode, isHTMLElement, LexicalEditor, LexicalNode, NodeKey, ParagraphNode, RangeSelection, SerializedElementNode } from "lexical";
import { addClassNamesToElement } from "@/utils/common";

function $convertBlockquoteElement(element: HTMLElement): DOMConversionOutput {
    const node = $createBgQuoteNode();
    if (element.style !== null) {
        node.setFormat(element.style.textAlign as ElementFormatType);
    }
    return { node };
}

export type SerializedQuoteNode = SerializedElementNode;

export class BgQuoteNode extends ElementNode {

    static getType(): string {
        return 'bg-quote';
    }

    static clone(node: BgQuoteNode): BgQuoteNode {
        return new BgQuoteNode(node.__key);
    }

    constructor(key?: NodeKey) {
        super(key);
    }

    createDOM(config: EditorConfig): HTMLElement {
        const element = document.createElement('blockquote');
        addClassNamesToElement(element, 'bg-quote-wrapper');
        return element;
    }
    updateDOM(prevNode: BgQuoteNode, dom: HTMLElement): boolean {
        return false;
    }

    static importDOM(): DOMConversionMap | null {
        return {
            blockquote: (node: Node) => ({
                conversion: $convertBlockquoteElement,
                priority: 0,
            }),
        };
    }

    exportDOM(editor: LexicalEditor): DOMExportOutput {
        const { element } = super.exportDOM(editor);

        if (element && isHTMLElement(element)) {
            if (this.isEmpty()) {
                element.append(document.createElement('br'));
            }

            const formatType = this.getFormatType();
            element.style.textAlign = formatType;

            const direction = this.getDirection();
            if (direction) {
                element.dir = direction;
            }
        }

        return {
            element,
        };
    }

    static importJSON(serializedNode: SerializedQuoteNode): BgQuoteNode {
        const node = $createBgQuoteNode();
        node.setFormat(serializedNode.format);
        node.setIndent(serializedNode.indent);
        node.setDirection(serializedNode.direction);
        return node;
    }

    exportJSON(): SerializedElementNode {
        return {
            ...super.exportJSON(),
            type: 'bg-quote',
        };
    }

    // Mutation

    insertNewAfter(_: RangeSelection, restoreSelection?: boolean): ParagraphNode {
        const newBlock = $createParagraphNode();
        const direction = this.getDirection();
        newBlock.setDirection(direction);
        this.insertAfter(newBlock, restoreSelection);
        return newBlock;
    }

    collapseAtStart(): true {
        const paragraph = $createParagraphNode();
        const children = this.getChildren();
        children.forEach((child) => paragraph.append(child));
        this.replace(paragraph);
        return true;
    }
}

export function $createBgQuoteNode(): BgQuoteNode {
    return $applyNodeReplacement(new BgQuoteNode());
}

export function $isBgQuoteNode(
    node: LexicalNode | null | undefined,
): node is BgQuoteNode {
    return node instanceof BgQuoteNode;
}