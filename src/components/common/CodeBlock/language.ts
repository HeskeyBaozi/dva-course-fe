const languages = [
  { name: 'C', mime: 'text/x-csrc', mode: 'clike', ext: [ 'c', 'h' ] },
  {
    name: 'C++',
    mime: 'text/x-c++src',
    mode: 'clike',
    ext: [ 'cpp', 'c++', 'cc', 'cxx', 'hpp', 'h++', 'hh', 'hxx' ],
    alias: [ 'cpp' ]
  },
  { name: 'C#', mime: 'text/x-csharp', mode: 'clike', ext: [ 'cs' ], alias: [ 'csharp' ] },
  { name: 'Java', mime: 'text/x-java', mode: 'clike', ext: [ 'java' ] },
  {
    name: 'JavaScript',
    mime: 'text/javascript',
    mode: 'javascript',
    ext: [ 'js' ],
    alias: [ 'ecmascript', 'js', 'node' ]
  },
  {
    name: 'JSON',
    mime: 'application/json',
    mode: 'javascript',
    ext: [ 'json', 'map' ],
    alias: [ 'json5' ]
  },
  { name: 'Plain Text', mime: 'text/plain', mode: 'null', ext: [ 'txt', 'text', 'conf', 'def', 'list', 'log' ] }
];

// C/C++/C#/Java

export function getMimeFromExt(language: string = 'txt') {
  const result = languages.find((target) => target.ext.some((ext) => ext === language));
  return result ? result.mime : 'text/plain';
}
