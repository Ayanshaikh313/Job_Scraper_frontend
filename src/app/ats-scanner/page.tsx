'use client';

import { useState } from 'react';
import { Upload, FileText, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

export default function ATSScannerPage() {
  const [resume, setResume] = useState<File | null>(null);
const [jobDescription, setJobDescription] = useState('');
const [loading, setLoading] = useState(false);
const [result, setResult] = useState<any>(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF resume');
      return;
    }

    setResume(file);
  };

  const handleAnalyze = async () => {
  if (!resume || !jobDescription) return;

  try {
    setLoading(true);

    const formData = new FormData();
    formData.append('resume', resume);
    formData.append('jobDescription', jobDescription);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/ats/analyze`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Analysis failed');
    }

    setResult(data.data);
  } catch (error) {
    console.error(error);
    alert('Failed to analyze resume');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border px-4 py-2 mb-6">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">
              AI Powered ATS Resume Scanner
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            ATS Resume Scanner
          </h1>

          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Upload your resume and compare it against a job description to
            discover missing skills, keyword gaps, ATS score, and improvement
            opportunities.
          </p>
        </div>

        {/* Scanner Section */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Card */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Resume</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              <label
                htmlFor="resume"
                className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-10 cursor-pointer hover:bg-muted/50 transition"
              >
                <Upload className="h-10 w-10 mb-3 text-muted-foreground" />

                <p className="font-medium">
                  {resume ? resume.name : 'Click to Upload PDF Resume'}
                </p>

                <p className="text-sm text-muted-foreground mt-2">
                  PDF files only
                </p>

                <Input
                  id="resume"
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>

              {resume && (
                <div className="rounded-lg border p-3 flex items-center gap-3">
                  <FileText className="h-5 w-5 text-green-600" />
                  <span className="text-sm">{resume.name}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Job Description Card */}
          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
            </CardHeader>

            <CardContent>
              <Textarea
                rows={14}
                placeholder="Paste the job description here...

Example:
We are looking for a React Developer with experience in Next.js, TypeScript, Tailwind CSS, Node.js, MongoDB, Git and REST APIs..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-10">
          <Button
  size="lg"
  onClick={handleAnalyze}
  disabled={!resume || !jobDescription || loading}
>
  {loading ? 'Analyzing...' : 'Analyze Resume'}
</Button>

        </div>
        {result && (
  <div className="mt-12">
    <Card>
      <CardHeader>
        <CardTitle>ATS Result</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <strong>ATS Score:</strong>{' '}
          {result.atsEvaluation?.totalScore}
        </div>

        <div>
          <strong>Recommendation:</strong>{' '}
          {result.atsEvaluation?.recommendation}
        </div>

        <div>
          <strong>Skills Found:</strong>{' '}
          {result.extractedSkills?.all?.join(', ')}
        </div>

        <div>
          <strong>Word Count:</strong>{' '}
          {result.resumeMetadata?.wordCount}
        </div>

        <div>
          <strong>Page Count:</strong>{' '}
          {result.resumeMetadata?.pageCount}
        </div>
      </CardContent>
    </Card>
  </div>
)}

        {/* Feature Highlights */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <Card>
            <CardContent className="pt-6">
              <CheckCircle className="h-8 w-8 mb-4 text-green-600" />
              <h3 className="font-semibold mb-2">Skill Extraction</h3>
              <p className="text-sm text-muted-foreground">
                Detect React, Next.js, Node.js, MongoDB, AWS, Docker and more.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <Sparkles className="h-8 w-8 mb-4" />
              <h3 className="font-semibold mb-2">ATS Scoring</h3>
              <p className="text-sm text-muted-foreground">
                Generate a realistic ATS score based on skills and keywords.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <AlertCircle className="h-8 w-8 mb-4 text-orange-500" />
              <h3 className="font-semibold mb-2">Gap Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Discover missing skills and keywords before applying.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Preview Section */}
        <div className="mt-16">
          <Card>
            <CardHeader>
              <CardTitle>Sample ATS Report</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">ATS Score</p>
                  <p className="text-3xl font-bold">87%</p>
                </div>

                <div className="border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">
                    Recommendation
                  </p>
                  <p className="text-lg font-semibold text-green-600">
                    Strong Match
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">
                    Matched Skills
                  </p>
                  <p className="text-lg font-semibold">12</p>
                </div>

                <div className="border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">
                    Missing Skills
                  </p>
                  <p className="text-lg font-semibold">3</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}