export interface QuizMCQ {
  question: string;
  options: string[];
  answer: string;
}

export interface ShortAnswer {
  question: string;
  answer: string;
}

export interface AISessionResponse {
  summary: string[];
  keyPoints: string[];
  mcqs: QuizMCQ[];
  shortAnswers: ShortAnswer[];
}

export const aiService = {
  async processNotes(notes: string): Promise<AISessionResponse> {
    // Simulating API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      summary: [
        "The core concepts revolve around efficient resource allocation in distributed systems.",
        "A key takeaway is that vertical scaling has limits, while horizontal scaling offers greater long-term flexibility.",
        "Latency is often the primary bottleneck rather than raw processing power."
      ],
      keyPoints: [
        "Distributed Systems scale better horizontally.",
        "Load balancers are critical for traffic management.",
        "State management should be decoupled from the compute layer."
      ],
      mcqs: [
        {
          question: "Which scaling method is usually preferred for high-availability systems?",
          options: ["Vertical Scaling", "Horizontal Scaling", "No Scaling", "Manual Scaling"],
          answer: "Horizontal Scaling"
        },
        {
          question: "What is the primary benefit of decoupling state from compute?",
          options: ["Lower Cost", "Easier Troubleshooting", "Statelessness & Easier Auto-scaling", "Nothing"],
          answer: "Statelessness & Easier Auto-scaling"
        }
      ],
      shortAnswers: [
        {
          question: "Define 'Latency' in the context of network performance.",
          answer: "The time delay between a request and a response over a network."
        }
      ]
    };
  }
};
