
import React, { useState } from 'react';
import { WordMapping } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Plus, Save, X } from 'lucide-react';
import { toast } from 'sonner';

interface DictionaryEditorProps {
  wordMappings: WordMapping[];
  onAdd: (mapping: Omit<WordMapping, 'id'>) => void;
  onUpdate: (id: string, mapping: Omit<WordMapping, 'id'>) => void;
  onDelete: (id: string) => void;
}

export const DictionaryEditor: React.FC<DictionaryEditorProps> = ({
  wordMappings,
  onAdd,
  onUpdate,
  onDelete
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<Omit<WordMapping, 'id'>>({
    english: '',
    hindi: '',
    kannada: '',
    partOfSpeech: 'noun',
    usageExample: '',
    synonyms: { hindi: [], kannada: [] }
  });

  const resetForm = () => {
    setFormData({
      english: '',
      hindi: '',
      kannada: '',
      partOfSpeech: 'noun',
      usageExample: '',
      synonyms: { hindi: [], kannada: [] }
    });
  };

  const handleEdit = (mapping: WordMapping) => {
    setEditingId(mapping.id);
    setFormData({
      english: mapping.english,
      hindi: mapping.hindi,
      kannada: mapping.kannada,
      partOfSpeech: mapping.partOfSpeech,
      usageExample: mapping.usageExample || '',
      synonyms: mapping.synonyms || { hindi: [], kannada: [] }
    });
  };

  const handleSave = () => {
    if (!formData.english || !formData.hindi || !formData.kannada) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (editingId) {
      onUpdate(editingId, formData);
      setEditingId(null);
      toast.success('Word mapping updated successfully!');
    } else {
      onAdd(formData);
      setShowAddForm(false);
      toast.success('Word mapping added successfully!');
    }
    resetForm();
  };

  const handleCancel = () => {
    setEditingId(null);
    setShowAddForm(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this mapping?')) {
      onDelete(id);
      toast.success('Word mapping deleted successfully!');
    }
  };

  const handleSynonymChange = (language: 'hindi' | 'kannada', value: string) => {
    const synonyms = value.split(',').map(s => s.trim()).filter(s => s);
    setFormData(prev => ({
      ...prev,
      synonyms: {
        ...prev.synonyms,
        [language]: synonyms
      }
    }));
  };

  const renderForm = () => (
    <Card className="mb-6 border-2 border-dashed border-blue-300">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>{editingId ? 'Edit Word Mapping' : 'Add New Word Mapping'}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="english">English Word *</Label>
            <Input
              id="english"
              value={formData.english}
              onChange={(e) => setFormData(prev => ({ ...prev, english: e.target.value }))}
              placeholder="Enter English word"
            />
          </div>
          <div>
            <Label htmlFor="hindi">Hindi Translation *</Label>
            <Input
              id="hindi"
              value={formData.hindi}
              onChange={(e) => setFormData(prev => ({ ...prev, hindi: e.target.value }))}
              placeholder="हिंदी अनुवाद"
            />
          </div>
          <div>
            <Label htmlFor="kannada">Kannada Translation *</Label>
            <Input
              id="kannada"
              value={formData.kannada}
              onChange={(e) => setFormData(prev => ({ ...prev, kannada: e.target.value }))}
              placeholder="ಕನ್ನಡ ಅನುವಾದ"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="partOfSpeech">Part of Speech</Label>
            <select
              id="partOfSpeech"
              value={formData.partOfSpeech}
              onChange={(e) => setFormData(prev => ({ ...prev, partOfSpeech: e.target.value as any }))}
              className="w-full px-3 py-2 border rounded-md bg-white"
            >
              <option value="noun">Noun</option>
              <option value="verb">Verb</option>
              <option value="adjective">Adjective</option>
              <option value="adverb">Adverb</option>
              <option value="phrase">Phrase</option>
            </select>
          </div>
          <div>
            <Label htmlFor="usageExample">Usage Example</Label>
            <Input
              id="usageExample"
              value={formData.usageExample}
              onChange={(e) => setFormData(prev => ({ ...prev, usageExample: e.target.value }))}
              placeholder="Example sentence"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="hindiSynonyms">Hindi Synonyms (comma-separated)</Label>
            <Input
              id="hindiSynonyms"
              value={formData.synonyms?.hindi?.join(', ') || ''}
              onChange={(e) => handleSynonymChange('hindi', e.target.value)}
              placeholder="synonym1, synonym2"
            />
          </div>
          <div>
            <Label htmlFor="kannadaSynonyms">Kannada Synonyms (comma-separated)</Label>
            <Input
              id="kannadaSynonyms"
              value={formData.synonyms?.kannada?.join(', ') || ''}
              onChange={(e) => handleSynonymChange('kannada', e.target.value)}
              placeholder="synonym1, synonym2"
            />
          </div>
        </div>

        <div className="flex space-x-2">
          <Button onClick={handleSave} className="flex items-center space-x-2">
            <Save className="w-4 h-4" />
            <span>{editingId ? 'Update' : 'Add'}</span>
          </Button>
          <Button variant="outline" onClick={handleCancel} className="flex items-center space-x-2">
            <X className="w-4 h-4" />
            <span>Cancel</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div>
      {(showAddForm || editingId) && renderForm()}
      
      {!showAddForm && !editingId && (
        <div className="mb-6">
          <Button onClick={() => setShowAddForm(true)} className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add New Word</span>
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {wordMappings.map((mapping) => (
          <Card key={mapping.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{mapping.english}</CardTitle>
                  <Badge variant="secondary" className="mt-1">
                    {mapping.partOfSpeech}
                  </Badge>
                </div>
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(mapping)}
                    className="p-2"
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(mapping.id)}
                    className="p-2 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <span className="font-medium text-orange-600">Hindi:</span> {mapping.hindi}
              </div>
              <div>
                <span className="font-medium text-red-600">Kannada:</span> {mapping.kannada}
              </div>
              {mapping.usageExample && (
                <div className="text-gray-600 italic">
                  "{mapping.usageExample}"
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
