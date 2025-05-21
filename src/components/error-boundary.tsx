"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, ChevronDown, ArrowLeft, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-50/50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl w-full"
      >
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <div className="flex items-start space-x-4">
            <div className="rounded-full p-2">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1 overflow-auto">
              <h1 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
                Something went wrong!
              </h1>
              <p className="text-gray-600 font-semibold mb-6">
                We apologize for the inconvenience. The error has been logged
                and we&apos;ll look into it.
              </p>
              <div className="space-y-4">
                <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                      size="sm"
                    >
                      <span className="text-sm font-semibold">
                        View technical details
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isOpen ? "transform rotate-180" : ""
                        }`}
                      />
                    </Button>
                  </CollapsibleTrigger>
                  <AnimatePresence>
                    {isOpen && (
                      <CollapsibleContent asChild forceMount>
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="mt-4 space-y-2 max-h-96 overflow-y-auto">
                          <div className="rounded-md bg-gray-50 p-4">
                            <div className="text-sm font-medium text-gray-900 mb-1">
                              Error Message:
                            </div>
                            <pre className="text-sm text-gray-600 whitespace-pre-wrap break-words overflow-auto">
                              {error.message}
                            </pre>
                          </div>
                          {error.stack && (
                            <div className="rounded-md bg-gray-50 p-4">
                              <div className="text-sm font-medium text-gray-900 mb-1">
                                Stack Trace:
                              </div>
                              <pre className="text-sm text-gray-600 whitespace-pre-wrap break-words max-h-48 overflow-auto">
                                {error.stack}
                              </pre>
                            </div>
                          )}
                          {error.digest && (
                            <div className="rounded-md bg-gray-50 p-4">
                              <div className="text-sm font-medium text-gray-900 mb-1">
                                Error ID:
                              </div>
                              <code className="text-sm text-gray-600">
                                {error.digest}
                              </code>
                            </div>
                          )}
                        </motion.div>
                      </CollapsibleContent>
                    )}
                  </AnimatePresence>
                </Collapsible>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    variant="default"
                    className="flex-1"
                    onClick={() => reset()}
                  >
                    <RefreshCcw className="w-4 h-4 mr-2" />
                    Try again
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleBack}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Go back
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
