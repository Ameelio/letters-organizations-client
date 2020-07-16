interface CustomFile extends File {
  path: string;
  type: string;
  name: string;
  lastModified: number;
  size: number;
  preview: string;
}
