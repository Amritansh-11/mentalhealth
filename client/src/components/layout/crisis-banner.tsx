export default function CrisisBanner() {
  return (
    <div className="crisis-alert text-white p-4 text-center" data-testid="crisis-banner">
      <div className="max-w-6xl mx-auto">
        <p className="font-semibold">
          <i className="fas fa-exclamation-triangle mr-2"></i>
          Crisis Support: If you're having thoughts of self-harm, call 988 (Suicide & Crisis Lifeline) or text "HELLO" to 741741
        </p>
      </div>
    </div>
  );
}
