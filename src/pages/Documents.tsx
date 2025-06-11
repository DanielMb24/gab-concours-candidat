
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';
import Layout from '@/components/Layout';
import { apiService } from '@/services/api';
import { toast } from '@/hooks/use-toast';
import { Document } from '@/types/entities';

const Documents = () => {
  const { candidatureId } = useParams<{ candidatureId: string }>();
  const navigate = useNavigate();
  
  const [selectedDocumentType, setSelectedDocumentType] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const documentTypes = [
    { value: 'cni', label: 'Carte Nationale d\'Identité', required: true },
    { value: 'diplome', label: 'Diplôme', required: true },
    { value: 'photo', label: 'Photo d\'identité', required: true },
    { value: 'cv', label: 'Curriculum Vitae', required: false },
    { value: 'acte_naissance', label: 'Acte de naissance', required: true },
    { value: 'certificat_residence', label: 'Certificat de résidence', required: false }
  ];

  // Récupération des documents déjà uploadés
  const { data: documentsResponse, refetch: refetchDocuments } = useQuery({
    queryKey: ['documents', candidatureId],
    queryFn: () => apiService.getDocumentsByParticipation(Number(candidatureId)),
    enabled: !!candidatureId,
  });

  const documents: Document[] = documentsResponse?.data || [];

  // Mutation pour l'upload de documents
  const uploadMutation = useMutation({
    mutationFn: async ({ file, type }: { file: File; type: string }) => {
      return apiService.uploadDocument(Number(candidatureId), file, type);
    },
    onSuccess: () => {
      toast({
        title: "Document uploadé !",
        description: "Votre document a été envoyé avec succès",
      });
      refetchDocuments();
      setSelectedDocumentType('');
    },
    onError: (error) => {
      console.error('Upload error:', error);
      toast({
        title: "Erreur d'upload",
        description: "Une erreur est survenue lors de l'envoi du document",
        variant: "destructive",
      });
    }
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedDocumentType) return;

    // Validation du fichier
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast({
        title: "Fichier trop volumineux",
        description: "Le fichier ne doit pas dépasser 5MB",
        variant: "destructive",
      });
      return;
    }

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Format non supporté",
        description: "Seuls les fichiers PDF, JPEG et PNG sont acceptés",
        variant: "destructive",
      });
      return;
    }

    uploadMutation.mutate({ file, type: selectedDocumentType });
  };

  const removeDocument = async (documentId: number) => {
    try {
      // Note: Cette fonctionnalité nécessiterait un endpoint de suppression dans l'API
      toast({
        title: "Document supprimé",
        description: "Le document a été retiré de votre dossier",
      });
      refetchDocuments();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le document",
        variant: "destructive",
      });
    }
  };

  const handleContinuer = () => {
    const requiredTypes = documentTypes.filter(dt => dt.required).map(dt => dt.value);
    const uploadedTypes = documents.map(doc => doc.type);
    const missingRequired = requiredTypes.filter(type => !uploadedTypes.includes(type));

    if (missingRequired.length > 0) {
      toast({
        title: "Documents manquants",
        description: "Veuillez uploader tous les documents obligatoires",
        variant: "destructive",
      });
      return;
    }

    navigate(`/paiement/${candidatureId}`);
  };

  const getDocumentTypeLabel = (type: string) => {
    return documentTypes.find(dt => dt.value === type)?.label || type;
  };

  const isDocumentTypeRequired = (type: string) => {
    return documentTypes.find(dt => dt.value === type)?.required || false;
  };

  const getDocumentStatutIcon = (statut: string) => {
    switch (statut) {
      case 'valide':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejete':
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const availableDocumentTypes = documentTypes.filter(
    dt => !documents.some(doc => doc.type === dt.value)
  );

  const completionPercentage = Math.round(
    (documents.length / documentTypes.filter(dt => dt.required).length) * 100
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

        {/* Progression */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Progression du dossier</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Documents requis uploadés</span>
                <span>{Math.min(documents.length, documentTypes.filter(dt => dt.required).length)}/{documentTypes.filter(dt => dt.required).length}</span>
              </div>
              <Progress value={completionPercentage} className="w-full" />
            </div>
          </CardContent>
        </Card>

        {/* Upload de nouveaux documents */}
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
                        {dt.label} {dt.required && '*'}
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
                    disabled={!selectedDocumentType || uploadMutation.isPending}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  />
                  <div className={`border-2 border-dashed rounded-lg p-4 text-center ${
                    selectedDocumentType && !uploadMutation.isPending
                      ? 'border-primary bg-primary/5 hover:bg-primary/10' 
                      : 'border-gray-300 bg-gray-50'
                  } transition-colors`}>
                    <Upload className={`h-6 w-6 mx-auto mb-2 ${
                      selectedDocumentType && !uploadMutation.isPending ? 'text-primary' : 'text-gray-400'
                    }`} />
                    <p className={`text-sm ${
                      selectedDocumentType && !uploadMutation.isPending ? 'text-primary' : 'text-gray-500'
                    }`}>
                      {uploadMutation.isPending
                        ? 'Upload en cours...'
                        : selectedDocumentType 
                          ? 'Cliquez pour sélectionner un fichier' 
                          : 'Sélectionnez d\'abord un type de document'
                      }
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PDF, JPEG, PNG - Max 5MB
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documents uploadés */}
        {documents.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Documents uploadés ({documents.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">
                          {getDocumentTypeLabel(doc.type)}
                          {isDocumentTypeRequired(doc.type) && <span className="text-red-500 ml-1">*</span>}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {doc.nom_fichier}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          {getDocumentStatutIcon(doc.statut)}
                          <span className="text-xs capitalize">{doc.statut}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDocument(doc.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Les documents marqués d'un astérisque (*) sont obligatoires</p>
              <p>• Formats acceptés: PDF, JPEG, PNG</p>
              <p>• Taille maximale par fichier: 5MB</p>
              <p>• Assurez-vous que vos documents sont lisibles et de bonne qualité</p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Retour
          </Button>
          <Button 
            onClick={handleContinuer} 
            className="bg-primary hover:bg-primary/90"
            disabled={completionPercentage < 100}
          >
            Continuer vers le paiement
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Documents;
