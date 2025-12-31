
import React from 'react';
import { ITILConcept } from './types';

export const ITIL_CONCEPTS: ITILConcept[] = [
  {
    title: "The 7 Guiding Principles",
    description: "Recommendations that can guide an organization in all circumstances, regardless of changes in its goals, strategies, type of work, or management structure.",
    keyPoints: [
      "Focus on value",
      "Start where you are",
      "Progress iteratively with feedback",
      "Collaborate and promote visibility",
      "Think and work holistically",
      "Keep it simple and practical",
      "Optimize and automate"
    ],
    icon: "🧭"
  },
  {
    title: "The 4 Dimensions",
    description: "The four perspectives that are critical to the effective and efficient facilitation of value for customers and other stakeholders in the form of products and services.",
    keyPoints: [
      "Organizations and people",
      "Information and technology",
      "Partners and suppliers",
      "Value streams and processes"
    ],
    icon: "🧊"
  },
  {
    title: "Service Value System (SVS)",
    description: "Describes how all the components and activities of an organization work together as a system to enable value creation.",
    keyPoints: [
      "Guiding principles",
      "Governance",
      "Service value chain",
      "Practices",
      "Continual improvement"
    ],
    icon: "⚙️"
  },
  {
    title: "Service Value Chain (SVC)",
    description: "An operating model which outlines the key activities required to respond to demand and facilitate value realization.",
    keyPoints: [
      "Plan",
      "Improve",
      "Engage",
      "Design & transition",
      "Obtain/build",
      "Deliver & support"
    ],
    icon: "🔗"
  }
];

export const CORE_DEFINITIONS = [
  { term: "Service", definition: "A means of enabling value co-creation by facilitating outcomes that customers want to achieve, without the customer having to manage specific costs and risks." },
  { term: "Utility", definition: "The functionality offered by a product or service to meet a particular need (fit for purpose)." },
  { term: "Warranty", definition: "Assurance that a product or service will meet agreed requirements (fit for use)." },
  { term: "Value", definition: "The perceived benefits, usefulness, and importance of something." },
  { term: "Output", definition: "A tangible or intangible deliverable of an activity." },
  { term: "Outcome", definition: "A result for a stakeholder enabled by one or more outputs." }
];
