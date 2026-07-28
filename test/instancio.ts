import { faker } from '@faker-js/faker';
import { getMetadataStorage } from 'class-validator';

type Ctor<T> = new (...args: never[]) => T;

/** 한 프로퍼티에 걸린 검증 규칙들. key 는 'isEmail' / 'isLength' 같은 validator 이름. */
type Rules = Map<string, unknown[]>;

function generate(rules: Rules): unknown {
  if (rules.has('isEmail')) {
    return faker.internet.email();
  }

  const length = rules.get('isLength') as number[] | undefined;
  if (length) {
    const [min, max] = length;
    return faker.string.alpha({ length: { min, max } });
  }

  return faker.lorem.word();
}

/**
 * class-validator 데코레이터를 읽어 제약을 만족하는 인스턴스를 만든다.
 * Instancio 의 Bean Validation 지원과 같은 원리이며,
 * Instancio 처럼 생성자를 우회하기 위해 Object.create 로 프로토타입만 세운다.
 *
 * overrides 는 Instancio 의 `.set(field(...), value)` 에 해당하며,
 * 검증 규칙을 무시하고 그대로 대입된다. (일부러 유효하지 않은 값을 넣기 위함)
 */
export function createInstance<T>(
  ctor: Ctor<T>,
  overrides: Partial<T> = {},
): T {
  const metadatas = getMetadataStorage().getTargetValidationMetadatas(
    ctor,
    ctor.name,
    true,
    false,
  );

  const rulesByProperty = new Map<string, Rules>();
  for (const metadata of metadatas) {
    if (!metadata.name) continue;

    const rules = rulesByProperty.get(metadata.propertyName) ?? new Map();
    rules.set(metadata.name, metadata.constraints);
    rulesByProperty.set(metadata.propertyName, rules);
  }

  const instance = Object.create(ctor.prototype) as Record<string, unknown>;
  for (const [property, rules] of rulesByProperty) {
    instance[property] = generate(rules);
  }

  return Object.assign(instance, overrides) as T;
}
