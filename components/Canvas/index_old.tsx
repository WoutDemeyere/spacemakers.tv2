import { useEffect, useState, useRef } from 'react';
import {
  Tldraw,
  Editor,
  TldrawUiMenuItem,
  useActions,
  useCanRedo,
  DefaultToolbar,
  TLComponents,
  DrawToolbarItem,
  useCanUndo,
  DefaultQuickActions,
  DefaultStylePanel,
  useEditor,
  exportToBlob,
  TLEventMap,
  StateNode,
  TLPointerEventInfo,
  TLEventInfo,
  Box,
  EraserToolbarItem,
  BoxModel,
  SelectionCorner,
  SelectionEdge,
  Vec,
  VecLike,
  TLBaseShape,
  ShapeUtil,
  T,
  RecordProps,
  Rectangle2d,
  Geometry2d
} from 'tldraw'
import 'tldraw/tldraw.css'

import { useSyncDemo } from '@tldraw/sync'

const components: TLComponents = {
  NavigationPanel: null,
  Toolbar: () => (
    <DefaultToolbar>
      <DrawToolbarItem />
    </DefaultToolbar>
  ),
  ActionsMenu: null,
  QuickActions: () => {
    const canUndo = useCanUndo();
    const canRedo = useCanRedo();
    const actions = useActions();
    const editor = useEditor();

    return (
      <DefaultQuickActions>
        <TldrawUiMenuItem {...actions.undo} disabled={!canUndo} />
        <TldrawUiMenuItem {...actions.redo} disabled={!canRedo} />
        <TldrawUiMenuItem {...actions.erase} />
      </DefaultQuickActions>
    );
  },
  PageMenu: null,
  MainMenu: null,
  StylePanel: () => {
    return (
      <DefaultStylePanel isMobile={true} />
    );
  },
};


type IBoundingBox = TLBaseShape<
	'bounding-box',
	{
    x: number,
    y: number,
		w: number
		h: number
	}
>

export class BoundingBoxUtil extends ShapeUtil<IBoundingBox> {
  component (shape: IBoundingBox) {
   console.log('BoundingBoxUtil.component', shape);
  }
  indicator (shape: IBoundingBox) {
    console.log('BoundingBoxUtil.indicator', shape);
  }
	// [a]
	static override type = 'bounding-box' as const
	static override props: RecordProps<IBoundingBox> = {
		x: T.number,
		y: T.number,
		w: T.number,
		h: T.number,
	}

	// [b]
	getDefaultProps(): IBoundingBox['props'] {
		return {
			x: 0,
			y: 0,
			w: 200,
			h: 200,
		}
	}

	// [c]
	override canEdit() {
		return false
	}
	override canResize() {
		return true
	}
	override isAspectRatioLocked() {
		return false
	}

	// [d]
	getGeometry(shape: IBoundingBox): Geometry2d {
		return new Rectangle2d({
			width: shape.props.w,
			height: shape.props.h,
			isFilled: false,
		})
	}


}


async function ExportCanvas(editor: Editor) {
  const shapeIds = editor.getCurrentPageShapeIds();
  if (shapeIds.size === 0) return null;

  // Potential improvement: Check if bounding box is large enough

  const blob = await exportToBlob({
    editor,
    ids: Array.from(shapeIds),
    format: 'png',
    opts: { background: false, bounds: boundingBox },
  });
  return blob;
}

// Helper function to convert Blob to Base64 Data URL
const blobToBase64 = (blob: Blob) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader();
  reader.onloadend = () => {
    if (typeof reader.result === 'string') {
      resolve(reader.result);
    } else {
      reject('Failed to convert blob to base64');
    }
  };
  reader.onerror = reject;
  reader.readAsDataURL(blob);
});

const SpaceTreeCanvas = () => {
  const [editor, setEditor] = useState<Editor | null>(null);

  const socketRef = useRef<WebSocket | null>(null);

  const handleMount = (editor: Editor) => {
    setEditor(editor);
    editor.setCurrentTool('draw')

    editor.setCamera({ x: 0, y: 0 });
    editor.createShape({
      type: 'bounding-box',
      x: boundingBox.x,
      y: boundingBox.y,
    });
  }

  useEffect(() => {
    // Initialize WebSocket connection when component mounts
    const socket = new WebSocket(`ws://${window.location.hostname}:8088`);
    socket.onopen = () => {
      console.log('WebSocket connection for canvas established.');
    };
    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    socketRef.current = socket;

    return () => {
      // Clean up the socket on unmount
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (!editor) return;

    const limitX = boundingBox.w;
    const limitY = boundingBox.h;

    // Limit camera movement
    editor.addListener("frame", () => {
      const { x, y } = editor.getCamera();
      if (Math.abs(x) > limitX) editor.setCamera({ x: limitX * Math.sign(x), y });
      if (Math.abs(y) > limitY) editor.setCamera({ x, y: limitY * Math.sign(y) });
    });

    const intervalId = setInterval(async () => {
      if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
        return;
      }

      const blob = await ExportCanvas(editor);
      if (blob) {
        const base64Data = await blobToBase64(blob);
        const message = {
          type: 'canvas',
          data: base64Data,
          timestamp: Date.now()
        };

        socketRef.current.send(JSON.stringify(message));
      }
    }, 33);

    return () => {
      editor.off("frame");
      clearInterval(intervalId);
    };
  }, [editor]);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0 }}className="tldraw__editor">
      {/* <Tldraw onMount={handleMount} components={components} /> */}
      <Tldraw shapeUtils={[BoundingBoxUtil]} onMount={handleMount} forceMobile/>
    </div>
  );
}

export default SpaceTreeCanvas;