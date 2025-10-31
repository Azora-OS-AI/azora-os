/*
AZORA PROPRIETARY LICENSE

Copyright © 2025 Azora ES (Pty) Ltd. All Rights Reserved.

See LICENSE file for details.
*/

'use client';

import { useState } from 'react';
import { IDELayout } from '@/components/ide-layout';
import { Sidebar } from '@/components/sidebar';
import { CodeEditor } from '@/components/code-editor';
import { ElaraAssistant } from '@/components/elara-assistant';
import { TerminalPanel } from '@/components/terminal-panel';
import { FileExplorer } from '@/components/file-explorer';

export default function Home() {
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [files, setFiles] = useState<string[]>([]);

  return (
    <IDELayout>
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <div className="flex-1 flex">
            <FileExplorer 
              files={files}
              activeFile={activeFile}
              onFileSelect={setActiveFile}
            />
            <CodeEditor activeFile={activeFile} />
            <ElaraAssistant />
          </div>
          <TerminalPanel />
        </div>
      </div>
    </IDELayout>
  );
}
