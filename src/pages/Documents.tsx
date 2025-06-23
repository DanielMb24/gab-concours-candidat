import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileText, CheckCircle, X } from 'lucide-react';
import Layout from '@/components/Layout';
import { apiService } from '@/services/api';
import { candidatureProgressService } from '@/services/candidatureProgress';
import { toast } from '@/hooks/use-toast';

const Documents = () => {
  const { candidatureId } = useParams<{ candidatureId: string }>();
  const navigate = useNavigate();

  const [files, setFiles] = useState<Record<string, File>>({});
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const documentsRequis = [
    { id: 'carte_identite', nom: 'Carte d\'identité', required: true },
    { id: 'diplome', nom: 'Diplôme ou attestation', required: true },
    { id: 'cv', nom: 'Curriculum Vitae', required: true },
    { id: 'photo', nom: 'Photo d\'identité', required: true },
    { id: 'certificat_medical', nom: 'Certificat médical', required: false }
  ];

  // Mutation pour uploader les documents
  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return apiService.createDossier(formData);
    },
    onSuccess: () => {
      toast({
        title: "Documents uploadés !",
        description: "Tous vos documents ont été enregistrés avec succès",
      });

      // Marquer l'étape documents comme complète
      if (candidatureId) {
        candidatureProgressService.markStepComplete(candidatureId, 'documents');
      }

      // Rediriger vers le paiement
      navigate(`/paiement/${candidatureId}`);
    },
    onError: (error) => {
      console.error('Upload error:', error);
      toast({
        title: "Erreur d'upload",
        description: "Une erreur est survenue lors de l'upload des documents",
        variant: "destructive",
      });
    }
  });

  const handleFileChange = (documentId: string, file: File | null) => {
    if (file) {
      setFiles(prev => ({ ...prev, [documentId]: file }));
      if (!uploadedFiles.includes(documentId)) {
        setUploadedFiles(prev => [...prev, documentId]);
      }
    } else {
      setFiles(prev => {
        const newFiles = { ...prev };
        delete newFiles[documentId];
        return newFiles;
      });
      setUploadedFiles(prev => prev.filter(id => id !== documentId));
    }
  };

  const handleUpload = () => {
    const requiredDocs = documentsRequis.filter(doc => doc.required);
    const missingDocs = requiredDocs.filter(doc => !files[doc.id]);

    if (missingDocs.length > 0) {
      toast({
        title: "Documents manquants",
        description: `Veuillez joindre tous les documents requis: ${missingDocs.map(d => d.nom).join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append('candidat_id', candidatureId || '1');

    Object.entries(files).forEach(([documentId, file]) => {
      formData.append('documents', file);
      formData.append('document_types', documentId);
    });

    uploadMutation.mutate(formData);
  };

  const removeFile = (documentId: string) => {
    handleFileChange(documentId, null);
  };

  const requiredDocsUploaded = documentsRequis
      .filter(doc => doc.required)
      .every(doc => files[doc.id]);

  return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Upload des Documents
            </h1>
            <p className="text-muted-foreground">
              Candidature: {candidatureId}
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Documents requis</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {documentsRequis.map((document) => (
                  <div key={document.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={document.id} className="flex items-center space-x-2">
                        <span>{document.nom}</span>
                        {document.required && <span className="text-red-500">*</span>}
                      </Label>
                      {uploadedFiles.includes(document.id) && (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                    </div>

                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                      {!files[document.id] ? (
                          <div className="text-center">
                            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <Input
                                id={document.id}
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => {
                                  const file = e.target.files?.[0] || null;
                                  handleFileChange(document.id, file);
                                }}
                                className="hidden"
                            />
                            <Label
                                htmlFor={document.id}
                                className="cursor-pointer text-sm text-blue-600 hover:text-blue-700"
                            >
                              Cliquez pour sélectionner un fichier
                            </Label>
                            <p className="text-xs text-muted-foreground mt-1">
                              PDF, JPG, PNG (max 5MB)
                            </p>
                          </div>
                      ) : (
                          <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                            <div className="flex items-center space-x-2">
                              <FileText className="h-4 w-4 text-green-600" />
                              <span className="text-sm font-medium text-green-700">
                          {files[document.id].name}
                        </span>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(document.id)}
                                className="text-red-500 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                      )}
                    </div>
                  </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => navigate(`/statut/${candidatureId}`)}>
              Retour au statut
            </Button>
            <Button
                onClick={handleUpload}
                disabled={!requiredDocsUploaded || uploadMutation.isPending}
                className="bg-primary hover:bg-primary/90"
            >
              {uploadMutation.isPending ? 'Upload en cours...' : 'Valider et continuer'}
            </Button>
          </div>
        </div>
      </Layout>
  );
};

export default Documents;
