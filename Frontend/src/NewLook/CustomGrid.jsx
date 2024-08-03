import React from 'react';
import { Rnd } from 'react-rnd';
import { FaTimes } from 'react-icons/fa';
import { FaArrowsAlt } from 'react-icons/fa';

const CustomGrid = ({
  components,
  visibility,
  zIndexes,
  headerInfo,
  bringToFront,
  toggleComponent,
  layouts,
  setLayouts,
  containerWidth,
}) => {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {Object.keys(components).map((key) => (
        visibility[key] ? (
          <Rnd
            key={key}
            default={{
              x: (layouts[key] && layouts[key].x) || 0,
              y: (layouts[key] && layouts[key].y) || 0,
              width: (layouts[key] && layouts[key].w) || 1100,
              height: (layouts[key] && layouts[key].h) || 1100,
            }}
            minWidth={200}
            minHeight={100}
            bounds="parent"
            dragHandleClassName="panel-drag"
            onDragStop={(e, d) => {
              const newLayout = { ...layouts[key], x: d.x, y: d.y };
              setLayouts({ ...layouts, [key]: newLayout });
            }}
            onResizeStop={(e, direction, ref, delta, position) => {
              const newLayout = {
                ...layouts[key],
                w: parseInt(ref.style.width, 10),
                h: parseInt(ref.style.height, 10),
                x: position.x,
                y: position.y,
              };
              setLayouts({ ...layouts, [key]: newLayout });
            }}
            enableResizing={{
              top: true,
              right: true,
              bottom: true,
              left: true,
              topRight: true,
              bottomRight: true,
              bottomLeft: true,
              topLeft: true,
            }}
            style={{
              zIndex: zIndexes[key] || 1,
              backgroundColor: '#fff',
              margin: '5px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div
              className="panel"
              onClick={() => bringToFront(key)}
              style={{
                height: '100%',
                overflowY: 'auto',
                overflowX: 'hidden',
              }}
            >
              <div
                className="panel-header"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  backgroundColor: headerInfo[key]?.color || '#fff',
                  padding: '5px',
                  borderBottom: '1px solid #ddd',
                }}
              >
                <div
                  className="panel-drag"
                  style={{
                    flexGrow: 1,
                    cursor: 'move',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {headerInfo[key]?.icon}
                  <span style={{ marginLeft: '10px' }}>
                    {headerInfo[key]?.title}
                  </span>
                </div>
                <FaTimes
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleComponent(key);
                  }}
                />
              </div>
              {components[key]}
            </div>
          </Rnd>
        ) : null
      ))}
    </div>
  );
};

export default CustomGrid;
