/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    // =============================================================
    // Rule 1: hexagonalArchitecture()
    // (Java: Architectures.layeredArchitecture()
    //          .layer("domain")      .definedBy("..domain..")
    //          .layer("application") .definedBy("..application..")
    //          .layer("adapter")     .definedBy("..adapter..")
    //          .whereLayer("domain")     .mayOnlyBeAccessedByLayers("application", "adapter")
    //          .whereLayer("application").mayOnlyBeAccessedByLayers("adapter")
    //          .whereLayer("adapter")    .mayNotBeAccessedByAnyLayer())
    //
    // ArchUnit의 whereLayer(...)는 "누가 나를 참조할 수 있는가"(들어오는 방향)를
    // 제한하는 규칙이므로, from.pathNot 으로 "허용된 계층이 아닌 모든 것"을
    // 잡아내는 형태로 옮긴다. 이렇게 하면 어느 계층에도 속하지 않는
    // src/common, src/support, src/main.ts 에서의 참조까지 함께 걸린다.
    //
    // 예외: NestJS의 *.module.ts 는 Composition Root(= Java의 스프링 설정)
    //       역할이므로 구현체(adapter)를 알아야만 와이어링할 수 있다.
    // =============================================================
    {
      name: 'domain-only-accessed-by-application-or-adapter',
      comment:
        'Domain 계층은 Application, Adapter(그리고 Domain 자신)에서만 접근할 수 있습니다',
      severity: 'error',
      from: {
        pathNot: [
          '^src/(domain|application|adapter)/',
          '^src/app\\.module\\.ts$', // Composition Root (엔티티 등록)
        ],
      },
      to: {
        path: '^src/domain/',
      },
    },
    {
      name: 'application-only-accessed-by-adapter',
      comment:
        'Application 계층은 Adapter(그리고 Application 자신)에서만 접근할 수 있습니다',
      severity: 'error',
      from: {
        pathNot: ['^src/(application|adapter)/', '^src/app\\.module\\.ts$'],
      },
      to: {
        path: '^src/application/',
      },
    },
    {
      name: 'adapter-not-accessed-by-any-layer',
      comment:
        'Adapter 계층은 어떤 계층에서도 접근할 수 없습니다 (DIP 원칙). Composition Root인 *.module.ts만 예외',
      severity: 'error',
      from: {
        pathNot: ['^src/adapter/', '\\.module\\.ts$'],
      },
      to: {
        path: '^src/adapter/',
      },
    },

    // =============================================================
    // Rule 2: aggregateFreeOfCycles()
    // (Java: slices().matching("..domain.(*)..").should().beFreeOfCycles())
    //
    // Rule 3: applicationServiceFreeOfCycles()
    // (Java: slices().matching("..application.(*)..").should().beFreeOfCycles())
    //
    // scope: 'folder' 는 모듈이 아니라 디렉터리 단위로 의존성을 본다.
    // from.path 의 캡처 그룹(= 슬라이스 이름)을 to.pathNot 에서 $1 로 되받아
    // "같은 슬라이스 내부"를 제외하고, 슬라이스 사이를 넘는 순환만 잡는다.
    //
    // 한계: dependency-cruiser의 폴더 그래프는 도착지를 항상 말단(leaf) 폴더로
    //       기록한다. 그래서 member/provided 같은 하위 폴더를 경유하는 순환은
    //       탐지되지 않을 수 있다. 모듈 단위 순환은 아래 no-circular가 잡는다.
    // =============================================================
    {
      name: 'domain-aggregates-free-of-cycles',
      comment: 'Domain 애그리거트(슬라이스) 사이에는 순환이 없어야 합니다',
      severity: 'error',
      scope: 'folder',
      from: {
        path: '^src/domain/([^/]+)',
      },
      to: {
        path: '^src/domain/[^/]+',
        pathNot: '^src/domain/$1',
        circular: true,
      },
    },
    {
      name: 'application-services-free-of-cycles',
      comment: 'Application 서비스(슬라이스) 사이에는 순환이 없어야 합니다',
      severity: 'error',
      scope: 'folder',
      from: {
        path: '^src/application/([^/]+)',
      },
      to: {
        path: '^src/application/[^/]+',
        pathNot: '^src/application/$1',
        circular: true,
      },
    },

    // =============================================================
    // Rule 4: aggregateDependencies()
    // (Java: 다른 슬라이스의 getter / record / enum 메소드만 호출할 수 있다)
    //
    // dependency-cruiser는 "어떤 모듈이 어떤 모듈을 import 하는가"까지만 본다.
    // 즉 메소드 호출 단위 검사(onlyCallGettersOrRecordMethodsOfOtherSlices)는
    // 이 도구로 표현할 수 없다. 필요하다면 ESLint 커스텀 룰이나 ts-morph 기반
    // 별도 테스트로 구현해야 한다.
    // =============================================================

    // =============================================================
    // 추가 규칙: 순환 의존성 금지 (모듈 단위 — Java 테스트에는 없는 규칙)
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
