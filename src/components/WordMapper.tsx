
import React, { useState, useMemo } from 'react';
import { WordMapping, ViewMode } from '@/types';
import { initialWordMappings } from '@/data/wordMappings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Languages, BookOpen, PlayCircle, Eye } from 'lucide-react';
import { DictionaryEditor } from './DictionaryEditor';
import { QuizMode } from './QuizMode';
import { GraphView } from './GraphView';

export const WordMapper = () => {
  const [wordMappings, setWordMappings] = useState<WordMapping[]>(initialWordMappings);
  const [viewMode, setViewMode] = useState<ViewMode>('both');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPartOfSpeech, setSelectedPartOfSpeech] = useState<string>('all');
  const [hoveredWord, setHoveredWord] = useState<string | null>(null);

  const filteredMappings = useMemo(() => {
    return wordMappings.filter(mapping => {
      const matchesSearch = 
        mapping.english.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mapping.hindi.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mapping.kannada.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesPartOfSpeech = selectedPartOfSpeech === 'all' || mapping.partOfSpeech === selectedPartOfSpeech;
      
      return matchesSearch && matchesPartOfSpeech;
    });
  }, [wordMappings, searchTerm, selectedPartOfSpeech]);

  const partOfSpeechOptions = ['all', 'noun', 'verb', 'adjective', 'adverb', 'phrase'];

  const handleAddMapping = (mapping: Omit<WordMapping, 'id'>) => {
    const newMapping: WordMapping = {
      ...mapping,
      id: Date.now().toString()
    };
    setWordMappings(prev => [...prev, newMapping]);
  };

  const handleUpdateMapping = (id: string, mapping: Omit<WordMapping, 'id'>) => {
    setWordMappings(prev => prev.map(m => m.id === id ? { ...mapping, id } : m));
  };

  const handleDeleteMapping = (id: string) => {
    setWordMappings(prev => prev.filter(m => m.id !== id));
  };

  const renderWordCard = (mapping: WordMapping) => (
    <Card 
      key={mapping.id} 
      className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500"
      onMouseEnter={() => setHoveredWord(mapping.english)}
      onMouseLeave={() => setHoveredWord(null)}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-bold text-gray-800">{mapping.english}</CardTitle>
          <Badge variant="secondary" className="text-xs">
            {mapping.partOfSpeech}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {(viewMode === 'hindi' || viewMode === 'both') && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 w-16">Hindi:</span>
            <span className="text-lg font-medium text-orange-600">{mapping.hindi}</span>
          </div>
        )}
        {(viewMode === 'kannada' || viewMode === 'both') && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 w-16">Kannada:</span>
            <span className="text-lg font-medium text-red-600">{mapping.kannada}</span>
          </div>
        )}
        {mapping.usageExample && (
          <div className="bg-gray-50 p-2 rounded text-sm italic text-gray-700">
            "{mapping.usageExample}"
          </div>
        )}
        {mapping.synonyms && (
          <div className="text-xs text-gray-500">
            {mapping.synonyms.hindi && viewMode !== 'kannada' && (
              <div>Hindi synonyms: {mapping.synonyms.hindi.join(', ')}</div>
            )}
            {mapping.synonyms.kannada && viewMode !== 'hindi' && (
              <div>Kannada synonyms: {mapping.synonyms.kannada.join(', ')}</div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent mb-2">
            English to Hindi & Kannada Word Mapper
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Interactive language learning tool with dual-language mapping, visual graphs, and quiz modes
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-6 justify-center">
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-gray-500" />
            <Input
              placeholder="Search words..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
          </div>
          
          <select
            value={selectedPartOfSpeech}
            onChange={(e) => setSelectedPartOfSpeech(e.target.value)}
            className="px-3 py-2 border rounded-md bg-white"
          >
            {partOfSpeechOptions.map(option => (
              <option key={option} value={option}>
                {option === 'all' ? 'All Parts of Speech' : option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>

          <div className="flex items-center space-x-2">
            <Languages className="w-4 h-4 text-gray-500" />
            <Button
              variant={viewMode === 'hindi' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('hindi')}
              className="text-orange-600 border-orange-600"
            >
              Hindi
            </Button>
            <Button
              variant={viewMode === 'kannada' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('kannada')}
              className="text-red-600 border-red-600"
            >
              Kannada
            </Button>
            <Button
              variant={viewMode === 'both' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('both')}
            >
              Both
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="dictionary" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="dictionary" className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4" />
              <span>Dictionary</span>
            </TabsTrigger>
            <TabsTrigger value="editor" className="flex items-center space-x-2">
              <Languages className="w-4 h-4" />
              <span>Editor</span>
            </TabsTrigger>
            <TabsTrigger value="quiz" className="flex items-center space-x-2">
              <PlayCircle className="w-4 h-4" />
              <span>Quiz</span>
            </TabsTrigger>
            <TabsTrigger value="graph" className="flex items-center space-x-2">
              <Eye className="w-4 h-4" />
              <span>Graph View</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dictionary">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMappings.map(renderWordCard)}
            </div>
            {filteredMappings.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No words found matching your search criteria.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="editor">
            <DictionaryEditor
              wordMappings={wordMappings}
              onAdd={handleAddMapping}
              onUpdate={handleUpdateMapping}
              onDelete={handleDeleteMapping}
            />
          </TabsContent>

          <TabsContent value="quiz">
            <QuizMode wordMappings={wordMappings} />
          </TabsContent>

          <TabsContent value="graph">
            <GraphView wordMappings={wordMappings} hoveredWord={hoveredWord} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
