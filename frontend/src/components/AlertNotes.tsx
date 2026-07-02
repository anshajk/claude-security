export function AlertNotes({ notes }: { notes: string }) {
  // Operator notes may include light formatting (e.g. <b>follow up</b>), so render as HTML.
  return <div className="alert__notes" dangerouslySetInnerHTML={{ __html: notes }} />;
}
