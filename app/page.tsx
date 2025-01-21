"use client";

import { DigitalPaperEditFormat, SlateNode } from "@/types";
import { useState } from "react";
//@ts-ignore
import { SlateTranscriptEditor } from "slate-transcript-editor";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface TranscriptMetadata {
  title: string;
  tags: string[];
  date: Date;
  speakers: string[];
  source_file: string;
  media: string;
  transcript_by: string;
}

export default function Home() {
  const [transcriptFile, setTranscriptFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [transcriptContent, setTranscriptContent] =
    useState<DigitalPaperEditFormat | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [metadata, setMetadata] = useState<TranscriptMetadata>({
    title: "",
    tags: [],
    date: new Date(),
    speakers: [],
    source_file: "",
    media: "",
    transcript_by: "",
  });

  const handleTranscriptFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setTranscriptFile(selectedFile);
      setIsLoading(true);
      setError(null);
      setIsSuccess(false);

      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const parsedContent = JSON.parse(e.target?.result as string);
          setTranscriptContent(parsedContent);
          setIsSuccess(true);
        } catch (err) {
          setError("Invalid file format: " + (err as Error).message);
        } finally {
          setIsLoading(false);
        }
      };

      reader.readAsText(selectedFile);
    }
  };

  const handleAudioFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setAudioFile(selectedFile);
      setAudioUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleSaveTranscript = async (
    edits: SlateNode[],
    speakers: string[]
  ) => {
    if (!transcriptFile) return;

    console.log("Saving transcript:", {
      transcriptSlate: edits,
      transcriptUrl: transcriptFile.name,
      metadata: {
        ...metadata,
        speakers,
        media: audioFile ? audioFile.name : "",
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full p-4">
        <Accordion
          type="single"
          collapsible
          defaultValue="files"
          className="mb-6"
        >
          <AccordionItem value="files">
            <AccordionTrigger className="text-xl font-semibold hover:no-underline">
              Επεξεργασία Απομαγνητοφώνησης
            </AccordionTrigger>
            <AccordionContent>
              <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Αρχείο DPE {!transcriptFile && "(απαραίτητο)"}
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        onChange={handleTranscriptFileChange}
                        accept="application/json"
                        className="block w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-md file:border-0
                          file:text-sm file:font-medium
                          file:bg-blue-50 file:text-blue-700
                          hover:file:bg-blue-100
                          focus:outline-none"
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {transcriptFile
                        ? `Τρέχον αρχείο: ${transcriptFile.name}`
                        : "Το αρχείο που λάβατε από την υπηρεσία απομαγνητοφώνησης"}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Αρχείο ήχου (προαιρετικό)
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        onChange={handleAudioFileChange}
                        accept="audio/*"
                        className="block w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-md file:border-0
                          file:text-sm file:font-medium
                          file:bg-blue-50 file:text-blue-700
                          hover:file:bg-blue-100
                          focus:outline-none"
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {audioFile
                        ? `Τρέχον αρχείο: ${audioFile.name}`
                        : "Χρήσιμο αν θέλετε να ακούτε το ηχητικό κατά την επεξεργασία"}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {isLoading && (
                    <div className="flex items-center justify-center py-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                      <span className="ml-3 text-sm text-gray-600">
                        Επεξεργασία αρχείου...
                      </span>
                    </div>
                  )}

                  {error && (
                    <div className="rounded-md bg-red-50 p-3">
                      <div className="flex">
                        <div className="text-sm text-red-700">
                          <p className="font-medium">Σφάλμα!</p>
                          <p>{error}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {isSuccess && (
                    <div className="rounded-md bg-green-50 p-3">
                      <div className="flex">
                        <div className="text-sm text-green-700">
                          <p className="font-medium">Επιτυχία!</p>
                          <p>
                            Τα αρχεία φορτώθηκαν και είναι έτοιμα για
                            επεξεργασία.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {transcriptContent && (
          <div className="w-full">
            <SlateTranscriptEditor
              transcriptData={transcriptContent}
              mediaUrl={audioUrl}
              handleSaveEditor={handleSaveTranscript}
              autoSaveContentType="slate"
              buttonConfig={{
                musicNote: false,
                replaceText: false,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
