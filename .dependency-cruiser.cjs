/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    // =============================================================
    // Rule 1: Application 계층은 adapter에 의존하면 안 된다
    // (Java: noClasses().that().resideInAPackage("..application..")
    //        .should().dependOnClassesThat().resideInAPackage("..adapter.."))
    // =============================================================
    {
      name: 'application-not-depend-on-adapter',
      comment:
        'Application 계층은 Adapter 계층에 의존하면 안 됩니다 (DIP 원칙). Module 파일은 Composition Root 역할이므로 예외',
      severity: 'error',
      from: {
        path: '^src/application/',
        pathNot: '\\.module\\.ts$', // NestJS Module은 Composition Root이므로 예외
      },
      to: {
        path: '^src/adapter/',
      },
    },

    // =============================================================
    // Rule 2: Domain 계층은 오직 domain 내부에만 의존해야 한다
    // (Java: classes().that().resideInAPackage("..domain..")
    //        .should().onlyDependOnClassesThat()
    //        .resideInAnyPackage("..domain..", "java.."))
    // =============================================================
    {
      name: 'domain-not-depend-on-application',
      comment: 'Domain 계층은 Application 계층에 의존하면 안 됩니다',
      severity: 'error',
      from: {
        path: '^src/domain/',
      },
      to: {
        path: '^src/application/',
      },
    },
    {
      name: 'domain-not-depend-on-adapter',
      comment: 'Domain 계층은 Adapter 계층에 의존하면 안 됩니다',
      severity: 'error',
      from: {
        path: '^src/domain/',
      },
      to: {
        path: '^src/adapter/',
      },
    },

    // =============================================================
    // Rule 3: Application은 application, adapter에서만 접근 가능
    // (Java: classes().that().resideInAPackage("..application..")
    //        .should().onlyHaveDependentClassesThat()
    //        .resideInAnyPackage("..application..", "..adapter.."))
    // =============================================================
    {
      name: 'application-only-accessed-by-adapter-or-application',
      comment:
        'Application 계층은 오직 Application 또는 Adapter에서만 접근 가능합니다',
      severity: 'error',
      from: {
        pathNot: ['^src/(application|adapter)/', '^src/app\\.module\\.ts$'],
      },
      to: {
        path: '^src/application/',
      },
    },

    // =============================================================
    // 추가 규칙: 순환 의존성 금지
    // =============================================================
    {
      name: 'no-circular',
      comment: '순환 의존성은 허용되지 않습니다',
      severity: 'error',
      from: {},
      to: {
        circular: true,
      },
    },

    // =============================================================
    // 추가 규칙: Adapter 하위 패키지 간 의존성 제한
    // (예: persistence는 webapi에 의존하면 안 됨)
    // =============================================================
    {
      name: 'adapter-subpackages-isolation',
      comment: 'Adapter 하위 패키지들은 서로 의존하면 안 됩니다',
      severity: 'warn',
      from: {
        path: '^src/adapter/(persistence|integration|security)/',
      },
      to: {
        path: '^src/adapter/webapi/',
      },
    },
    {
      name: 'webapi-not-depend-on-other-adapters',
      comment: 'WebAPI는 다른 Adapter 하위 패키지에 의존하면 안 됩니다',
      severity: 'warn',
      from: {
        path: '^src/adapter/webapi/',
      },
      to: {
        path: '^src/adapter/(persistence|integration|security)/',
      },
    },
  ],

  options: {
    doNotFollow: {
      path: ['node_modules'],
    },

    includeOnly: ['^src/'],

    tsPreCompilationDeps: true,

    tsConfig: {
      fileName: 'tsconfig.json',
    },

    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'require', 'node', 'default', 'types'],
      mainFields: ['main', 'types', 'typings'],
    },

    reporterOptions: {
      dot: {
        collapsePattern: [
          'node_modules/(?:@[^/]+/[^/]+|[^/]+)',
          '^src/domain/[^/]+/',
          '^src/application/[^/]+/',
          '^src/adapter/[^/]+/',
        ],
        theme: {
          graph: {
            splines: 'ortho',
            rankdir: 'TB',
            fontname: 'Helvetica',
            fontsize: '14',
            bgcolor: '#fdfdfd',
            pad: '0.4',
            nodesep: '0.6',
            ranksep: '0.8',
          },
          node: {
            fontname: 'Helvetica',
            fontsize: '11',
            shape: 'box',
            style: 'rounded,filled',
            height: '0.35',
            color: '#bbbbbb',
            penwidth: '1.2',
          },
          edge: {
            fontname: 'Helvetica',
            fontsize: '9',
            arrowsize: '0.7',
            penwidth: '1.2',
            color: '#888888',
          },
          modules: [
            {
              criteria: { source: '^src/domain/' },
              attributes: {
                fillcolor: '#fff3e0',
                color: '#e65100',
                fontcolor: '#bf360c',
              },
            },
            {
              criteria: { source: '^src/application/' },
              attributes: {
                fillcolor: '#e8f5e9',
                color: '#2e7d32',
                fontcolor: '#1b5e20',
              },
            },
            {
              criteria: { source: '^src/adapter/' },
              attributes: {
                fillcolor: '#e3f2fd',
                color: '#1565c0',
                fontcolor: '#0d47a1',
              },
            },
          ],
          dependencies: [
            {
              criteria: { valid: false },
              attributes: {
                color: '#d32f2f',
                style: 'bold',
                penwidth: '2.0',
                fontcolor: '#d32f2f',
              },
            },
            {
              criteria: { valid: true },
              attributes: {
                color: '#9e9e9e',
                style: 'solid',
              },
            },
          ],
        },
      },
      text: {
        highlightFocused: true,
      },
    },
  },
};
