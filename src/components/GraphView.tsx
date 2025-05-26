
import React, { useMemo } from 'react';
import { WordMapping } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Network } from 'lucide-react';

interface GraphViewProps {
  wordMappings: WordMapping[];
  hoveredWord?: string | null;
}

export const GraphView: React.FC<GraphViewProps> = ({ wordMappings, hoveredWord }) => {
  const graphData = useMemo(() => {
    const nodes: Array<{ id: string; label: string; type: 'english' | 'hindi' | 'kannada'; x: number; y: number }> = [];
    const edges: Array<{ from: string; to: string; color: string }> = [];

    // Create nodes and position them
    wordMappings.forEach((mapping, index) => {
      const y = (index * 80) + 50;
      
      // English node (left)
      nodes.push({
        id: `en-${mapping.id}`,
        label: mapping.english,
        type: 'english',
        x: 50,
        y
      });

      // Hindi node (center)
      nodes.push({
        id: `hi-${mapping.id}`,
        label: mapping.hindi,
        type: 'hindi',
        x: 250,
        y
      });

      // Kannada node (right)
      nodes.push({
        id: `kn-${mapping.id}`,
        label: mapping.kannada,
        type: 'kannada',
        x: 450,
        y
      });

      // Create edges
      edges.push({
        from: `en-${mapping.id}`,
        to: `hi-${mapping.id}`,
        color: '#f97316'
      });

      edges.push({
        from: `en-${mapping.id}`,
        to: `kn-${mapping.id}`,
        color: '#dc2626'
      });

      edges.push({
        from: `hi-${mapping.id}`,
        to: `kn-${mapping.id}`,
        color: '#8b5cf6'
      });
    });

    return { nodes, edges };
  }, [wordMappings]);

  const getNodeStyle = (node: typeof graphData.nodes[0]) => {
    const isHighlighted = hoveredWord && 
      wordMappings.some(m => m.english === hoveredWord && 
        (node.label === m.english || node.label === m.hindi || node.label === m.kannada)
      );

    let bgColor = 'bg-gray-100';
    let textColor = 'text-gray-800';
    let borderColor = 'border-gray-300';

    if (node.type === 'english') {
      bgColor = 'bg-blue-100';
      textColor = 'text-blue-800';
      borderColor = 'border-blue-300';
    } else if (node.type === 'hindi') {
      bgColor = 'bg-orange-100';
      textColor = 'text-orange-800';
      borderColor = 'border-orange-300';
    } else if (node.type === 'kannada') {
      bgColor = 'bg-red-100';
      textColor = 'text-red-800';
      borderColor = 'border-red-300';
    }

    if (isHighlighted) {
      bgColor = bgColor.replace('100', '200');
      borderColor = borderColor.replace('300', '500');
    }

    return `${bgColor} ${textColor} border-2 ${borderColor} ${isHighlighted ? 'shadow-lg scale-105' : 'shadow'} transition-all duration-300`;
  };

  const functionAnalysis = useMemo(() => {
    const englishToHindi = new Map<string, string[]>();
    const englishToKannada = new Map<string, string[]>();

    wordMappings.forEach(mapping => {
      if (!englishToHindi.has(mapping.english)) {
        englishToHindi.set(mapping.english, []);
      }
      if (!englishToKannada.has(mapping.english)) {
        englishToKannada.set(mapping.english, []);
      }
      
      englishToHindi.get(mapping.english)!.push(mapping.hindi);
      englishToKannada.get(mapping.english)!.push(mapping.kannada);
    });

    const isHindiFunction = Array.from(englishToHindi.values()).every(translations => translations.length === 1);
    const isKannadaFunction = Array.from(englishToKannada.values()).every(translations => translations.length === 1);

    return { isHindiFunction, isKannadaFunction };
  }, [wordMappings]);

  return (
    <div className="space-y-6">
      {/* Function Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Network className="w-5 h-5" />
            <span>Mapping Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex space-x-4">
          <Badge 
            variant={functionAnalysis.isHindiFunction ? "default" : "destructive"}
            className={functionAnalysis.isHindiFunction ? "bg-green-500" : "bg-red-500"}
          >
            English → Hindi: {functionAnalysis.isHindiFunction ? "Function" : "Relation"}
          </Badge>
          <Badge 
            variant={functionAnalysis.isKannadaFunction ? "default" : "destructive"}
            className={functionAnalysis.isKannadaFunction ? "bg-green-500" : "bg-red-500"}
          >
            English → Kannada: {functionAnalysis.isKannadaFunction ? "Function" : "Relation"}
          </Badge>
        </CardContent>
      </Card>

      {/* Graph Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Tripartite Graph View</CardTitle>
          <div className="flex space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-200 border border-blue-300 rounded"></div>
              <span>English</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-orange-200 border border-orange-300 rounded"></div>
              <span>Hindi</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-200 border border-red-300 rounded"></div>
              <span>Kannada</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto">
            <svg 
              width="550" 
              height={Math.max(400, wordMappings.length * 80 + 100)}
              className="border rounded-lg bg-gray-50"
            >
              {/* Draw edges first (so they appear behind nodes) */}
              {graphData.edges.map((edge, index) => {
                const fromNode = graphData.nodes.find(n => n.id === edge.from);
                const toNode = graphData.nodes.find(n => n.id === edge.to);
                
                if (!fromNode || !toNode) return null;

                const isHighlighted = hoveredWord && 
                  wordMappings.some(m => m.english === hoveredWord && 
                    (fromNode.label === m.english || fromNode.label === m.hindi || fromNode.label === m.kannada) &&
                    (toNode.label === m.english || toNode.label === m.hindi || toNode.label === m.kannada)
                  );

                return (
                  <line
                    key={index}
                    x1={fromNode.x + 60}
                    y1={fromNode.y + 15}
                    x2={toNode.x}
                    y2={toNode.y + 15}
                    stroke={edge.color}
                    strokeWidth={isHighlighted ? 3 : 1}
                    opacity={isHighlighted ? 0.8 : 0.3}
                    className="transition-all duration-300"
                  />
                );
              })}

              {/* Draw nodes */}
              {graphData.nodes.map((node, index) => (
                <g key={index}>
                  <foreignObject 
                    x={node.x} 
                    y={node.y} 
                    width="120" 
                    height="30"
                  >
                    <div 
                      className={`px-3 py-1 rounded-md text-sm font-medium truncate ${getNodeStyle(node)}`}
                      title={node.label}
                    >
                      {node.label}
                    </div>
                  </foreignObject>
                </g>
              ))}
            </svg>
          </div>
          
          {/* Legend */}
          <div className="mt-4 text-sm text-gray-600">
            <p><strong>Hover over words in the dictionary</strong> to highlight connections in the graph.</p>
            <p>Lines represent translation relationships between languages.</p>
          </div>
        </CardContent>
      </Card>

      {/* Matrix View */}
      <Card>
        <CardHeader>
          <CardTitle>Matrix View</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* English-Hindi Matrix */}
            <div>
              <h4 className="font-semibold mb-2">English ↔ Hindi</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs border">
                  <thead>
                    <tr>
                      <th className="border p-1 bg-gray-100"></th>
                      {wordMappings.map(m => (
                        <th key={m.id} className="border p-1 bg-orange-100 writing-mode-vertical text-orange-800">
                          {m.hindi}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {wordMappings.map(mapping => (
                      <tr key={mapping.id}>
                        <td className="border p-1 bg-blue-100 font-medium text-blue-800">
                          {mapping.english}
                        </td>
                        {wordMappings.map(m => (
                          <td key={m.id} className="border p-1 text-center">
                            {mapping.english === m.english ? '●' : ''}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* English-Kannada Matrix */}
            <div>
              <h4 className="font-semibold mb-2">English ↔ Kannada</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs border">
                  <thead>
                    <tr>
                      <th className="border p-1 bg-gray-100"></th>
                      {wordMappings.map(m => (
                        <th key={m.id} className="border p-1 bg-red-100 writing-mode-vertical text-red-800">
                          {m.kannada}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {wordMappings.map(mapping => (
                      <tr key={mapping.id}>
                        <td className="border p-1 bg-blue-100 font-medium text-blue-800">
                          {mapping.english}
                        </td>
                        {wordMappings.map(m => (
                          <td key={m.id} className="border p-1 text-center">
                            {mapping.english === m.english ? '●' : ''}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
