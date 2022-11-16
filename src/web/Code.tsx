export type CodeProps = {
  value: any;
}

export function Code(props: CodeProps) {
  const json = JSON.stringify(props.value, null, 2);
  return (
    <code className="code">{json}</code>
  );
}
