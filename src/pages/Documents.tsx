
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, FileText, X } from 'lucide-react';
import Layout from '@/components/Layout';

const Documents = () => {
  const { candidatureId } = useParams<{ candidatureId: string }>();
  const navigate = useNavigate();
  
  const [documents, setDocuments] = useState<Array<{type: string, file: File | null}>>([]);
  const [selectedDocumentType, setSelectedDocumentType] = useState('');

  const documentTypes = [
    { value: 'cni', label: 'Carte Nationale d\'Identité' },
    { value: 'diplome', label: 'Diplôme' },
    { value: 'photo', label: 'Photo d\'identité' },
    { value: 'cv', label: 'Curriculum Vitae' }
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedDocumentType) return;

    const newDocument = {
      type: selectedDocumentType,
      file
    };

    setDocuments(prev => [...prev, newDocument]);
    setSelectedDocumentType('');
  };

  const removeDocument = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const handleContinuer = () => {
    navigate(`/paiement/${candidatureId}`);
  };

  const getDocumentTypeLabel = (type: string) => {
    return documentTypes.find(dt => dt.value === type)?.label || type;
  };

  const availableDocumentTypes = documentTypes.filter(
    dt => !documents.some(doc => doc.type === dt.value)
  );

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Dépôt des Documents
          </h1>
          <p className="text-muted-foreground">
            Candidature: {candidatureId}
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Ajouter vos documents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Select value={selectedDocumentType} onValueChange={setSelectedDocumentType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir le type de document" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDocumentTypes.map(dt => (
                      <SelectItem key={dt.value} value={dt.value}>
                        {dt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <div className="relative">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileSelect}
                    disabled={!selectedDocumentType}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  />
                  <div className={`border-2 border-dashed rounded-lg p-4 text-center ${
                    selectedDocumentType 
                      ? 'border-primary bg-primary/5 hover:bg-primary/10' 
                      : 'border-gray-300 bg-gray-50'
                  } transition-colors`}>
                    <Upload className={`h-6 w-6 mx-auto mb-2 ${
                      selectedDocumentType ? 'text-primary' : 'text-gray-400'
                    }`} />
                    <p className={`text-sm ${
                      selectedDocumentType ? 'text-primary' : 'text-gray-500'
                    }`}>
                      {selectedDocumentType 
                        ? 'Cliquez pour sélectionner un fichier' 
                        : 'Sélectionnez d\'abord un type de document'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {documents.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Documents sélectionnés ({documents.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">{getDocumentTypeLabel(doc.type)}</p>
                        <p className="text-sm text-muted-foreground">
                          {doc.file?.name}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDocument(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Retour
          </Button>
          <Button onClick={handleContinuer} className="bg-primary hover:bg-primary/90">
            Continuer vers le paiement
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Documents;
