

export function Log(
  target: object,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor
): void {
  const originalMethod = descriptor.value as (
    ...args: any[]
  ) => any;

  descriptor.value = function (
    this: unknown,
    ...args: any[]
  ): any {
    console.log(`[CALL] ${String(propertyKey)}`, args);

    try {
      const result = originalMethod.apply(this, args);
      console.log(`[RETURN] ${String(propertyKey)}`, result);
      return result;
    } catch (error: unknown) {
      console.error(`[ERROR] ${String(propertyKey)}`, error);
      throw error;
    }
  };
}

export function MeasureTime(
  target: object,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor
): void {
  const originalMethod = descriptor.value as (
    ...args: any[]
  ) => any;

  descriptor.value = function (
    this: unknown,
    ...args: any[]
  ): any {
    const start = Date.now();

    try {
      return originalMethod.apply(this, args);
    } finally {
      console.log(
        `[TIME] ${String(propertyKey)}: ${Date.now() - start} ms`
      );
    }
  };
}


export function ValidateSpellPower(
  target: object,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor
): void {
  const originalMethod = descriptor.value as (
    ...args: any[]
  ) => any;

  descriptor.value = function (
    this: unknown,
    ...args: any[]
  ): any {
    const spell = args[0] as { power?: unknown } | undefined;

    if (
      spell &&
      typeof spell.power === "number" &&
      spell.power < 0
    ) {
      throw new Error(
        `${String(propertyKey)}: spell power cannot be negative.`
      );
    }

    return originalMethod.apply(this, args);
  };
}


const methodCaches = new WeakMap<object, Map<string, unknown>>();

export function Cache(
  target: object,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor
): void {
  const originalMethod = descriptor.value as (
    ...args: any[]
  ) => any;

  descriptor.value = function (
    this: object,
    ...args: any[]
  ): any {
    let cache = methodCaches.get(this);

    if (!cache) {
      cache = new Map<string, unknown>();
      methodCaches.set(this, cache);
    }

    const key = `${String(propertyKey)}:${JSON.stringify(args)}`;

    if (cache.has(key)) {
      console.log(`[CACHE HIT] ${String(propertyKey)}`);
      return cache.get(key);
    }

    const result = originalMethod.apply(this, args);
    cache.set(key, result);

    console.log(`[CACHE SET] ${String(propertyKey)}`);
    return result;
  };
}
