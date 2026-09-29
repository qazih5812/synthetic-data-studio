module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/runtime-reacts.external.js [external] (next/dist/server/runtime-reacts.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/runtime-reacts.external.js", () => require("next/dist/server/runtime-reacts.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/node:stream [external] (node:stream, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:stream", () => require("node:stream"));

module.exports = mod;
}),
"[project]/src/app/api/generate/tabular/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$deterministic$2d$generator$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/deterministic-generator.ts [app-route] (ecmascript)");
;
;
async function POST(req) {
    try {
        const { schema, rowCount, locale, seed, injectEdgeCases, nullRate, constraints } = await req.json();
        if (!schema) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Schema definition is required'
            }, {
                status: 400
            });
        }
        const totalRows = Math.min(Math.max(1, rowCount || 10), 500);
        // ── Parse schema ──────────────────────────────────────────────────────────
        let fields;
        if (Array.isArray(schema)) {
            // From wizard/plan — already structured
            fields = schema;
        } else if (typeof schema === 'string') {
            // From manual text input: "id:id, name:name, email:email, salary:salary"
            fields = parseTextSchema(schema, injectEdgeCases, nullRate);
        } else if (typeof schema === 'object' && schema.fields) {
            fields = schema.fields;
        } else {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Schema must be a string spec or array of field objects.'
            }, {
                status: 400
            });
        }
        if (fields.length === 0) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'No valid fields could be parsed from the schema.'
            }, {
                status: 400
            });
        }
        // Apply edge case settings
        if (injectEdgeCases) {
            fields = fields.map((f)=>({
                    ...f,
                    nullRate: f.primaryKey ? 0 : nullRate ?? 0.05
                }));
        }
        const tableSchema = {
            name: 'GeneratedTable',
            fields,
            rows: totalRows,
            seed: seed ?? 42
        };
        // ── Generate ──────────────────────────────────────────────────────────────
        const data = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$deterministic$2d$generator$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateTable"])(tableSchema, locale || 'en-US');
        // ── Validate ──────────────────────────────────────────────────────────────
        const validation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$deterministic$2d$generator$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["validateTabularData"])(data, {
            fields
        }, constraints || []);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            data,
            validation,
            rowCount: data.length
        });
    } catch (error) {
        console.error('[/api/generate/tabular] Error:', error.message);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error.message || 'Internal Server Error'
        }, {
            status: 500
        });
    }
}
/**
 * Parse a simple text schema like:
 *   "id:id, name:name, email:email, age:integer, status:status"
 * into FieldSchema objects.
 */ function parseTextSchema(text, injectEdgeCases, nullRate) {
    return text.split(',').map((part)=>part.trim()).filter(Boolean).map((part, index)=>{
        const colonIdx = part.indexOf(':');
        let name, typeHint;
        if (colonIdx !== -1) {
            name = part.slice(0, colonIdx).trim().replace(/\s+/g, '_');
            typeHint = part.slice(colonIdx + 1).trim().toLowerCase();
        } else {
            name = part.trim().replace(/\s+/g, '_');
            typeHint = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$deterministic$2d$generator$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["inferFieldType"])(name, []).toString();
        }
        const isPK = name.toLowerCase() === 'id' || index === 0 && name.toLowerCase().endsWith('id');
        return {
            name,
            type: mapTypeHint(typeHint, name),
            primaryKey: isPK,
            unique: isPK,
            nullable: !isPK && (injectEdgeCases ?? false),
            nullRate: !isPK && injectEdgeCases ? nullRate ?? 0.05 : 0
        };
    });
}
function mapTypeHint(hint, name) {
    const map = {
        'id': 'id',
        'integer': 'integer',
        'int': 'integer',
        'number': 'integer',
        'float': 'float',
        'decimal': 'float',
        'double': 'float',
        'string': 'string',
        'text': 'string',
        'varchar': 'string',
        'boolean': 'boolean',
        'bool': 'boolean',
        'name': 'name',
        'fullname': 'name',
        'full_name': 'name',
        'first_name': 'first_name',
        'firstname': 'first_name',
        'last_name': 'last_name',
        'lastname': 'last_name',
        'email': 'email',
        'mail': 'email',
        'phone': 'phone',
        'mobile': 'phone',
        'tel': 'phone',
        'address': 'address',
        'city': 'city',
        'country': 'country',
        'company': 'company',
        'employer': 'company',
        'date': 'date',
        'datetime': 'datetime',
        'timestamp': 'datetime',
        'price': 'price',
        'currency': 'currency',
        'amount': 'currency',
        'salary': 'salary',
        'wage': 'salary',
        'status': 'status',
        'gender': 'gender',
        'role': 'role',
        'categorical': 'categorical',
        'category': 'categorical',
        'url': 'url',
        'ip': 'ip',
        'description': 'description',
        'uuid': 'uuid'
    };
    if (map[hint]) return map[hint];
    // Fall back to name-based inference
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$deterministic$2d$generator$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["inferFieldType"])(name, []);
}
}),
"[project]/src/lib/deterministic-generator.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * deterministic-generator.ts
 *
 * A pure TypeScript, zero-dependency deterministic data generator.
 * Uses a seeded LCG (Linear Congruential Generator) for reproducibility.
 * This replaces LLM-per-row generation for structured tabular/relational data.
 */ // ─── Seeded PRNG (LCG) ─────────────────────────────────────────────────────
__turbopack_context__.s([
    "SeededRandom",
    ()=>SeededRandom,
    "generateTable",
    ()=>generateTable,
    "inferFieldType",
    ()=>inferFieldType,
    "inferForeignKeys",
    ()=>inferForeignKeys,
    "inferPrimaryKey",
    ()=>inferPrimaryKey,
    "validateRelationalData",
    ()=>validateRelationalData,
    "validateTabularData",
    ()=>validateTabularData
]);
class SeededRandom {
    seed;
    constructor(seed = 42){
        this.seed = seed % 2147483647;
        if (this.seed <= 0) this.seed += 2147483646;
    }
    /** Returns a float in [0, 1) */ next() {
        this.seed = this.seed * 16807 % 2147483647;
        return (this.seed - 1) / 2147483646;
    }
    /** Returns an integer in [min, max] */ int(min, max) {
        return Math.floor(this.next() * (max - min + 1)) + min;
    }
    /** Returns a float in [min, max) */ float(min, max, decimals = 2) {
        return parseFloat((this.next() * (max - min) + min).toFixed(decimals));
    }
    /** Pick a random element from array */ pick(arr) {
        return arr[Math.floor(this.next() * arr.length)];
    }
    /** Returns true with given probability */ chance(probability) {
        return this.next() < probability;
    }
    /** Shuffle array in place or copy */ shuffle(arr) {
        const a = [
            ...arr
        ];
        for(let i = a.length - 1; i > 0; i--){
            const j = Math.floor(this.next() * (i + 1));
            [a[i], a[j]] = [
                a[j],
                a[i]
            ];
        }
        return a;
    }
}
const LOCALE_DATA = {
    'en-US': {
        firstNames: [
            'James',
            'Mary',
            'John',
            'Patricia',
            'Robert',
            'Jennifer',
            'Michael',
            'Linda',
            'William',
            'Barbara',
            'David',
            'Elizabeth',
            'Richard',
            'Susan',
            'Joseph',
            'Jessica',
            'Thomas',
            'Sarah',
            'Charles',
            'Karen',
            'Christopher',
            'Lisa',
            'Daniel',
            'Nancy',
            'Matthew',
            'Betty',
            'Anthony',
            'Margaret',
            'Mark',
            'Sandra',
            'Donald',
            'Ashley',
            'Steven',
            'Dorothy',
            'Paul',
            'Kimberly',
            'Andrew',
            'Emily',
            'Kenneth',
            'Donna'
        ],
        lastNames: [
            'Smith',
            'Johnson',
            'Williams',
            'Brown',
            'Jones',
            'Garcia',
            'Miller',
            'Davis',
            'Rodriguez',
            'Martinez',
            'Hernandez',
            'Lopez',
            'Gonzalez',
            'Wilson',
            'Anderson',
            'Thomas',
            'Taylor',
            'Moore',
            'Jackson',
            'Martin',
            'Lee',
            'Perez',
            'Thompson',
            'White',
            'Harris',
            'Sanchez',
            'Clark',
            'Ramirez',
            'Lewis',
            'Robinson',
            'Walker',
            'Young',
            'Allen',
            'King',
            'Wright',
            'Scott',
            'Torres',
            'Nguyen',
            'Hill',
            'Flores'
        ],
        cities: [
            'New York',
            'Los Angeles',
            'Chicago',
            'Houston',
            'Phoenix',
            'Philadelphia',
            'San Antonio',
            'San Diego',
            'Dallas',
            'San Jose',
            'Austin',
            'Jacksonville',
            'Fort Worth',
            'Columbus',
            'Charlotte',
            'Indianapolis',
            'San Francisco',
            'Seattle',
            'Denver',
            'Nashville'
        ],
        countries: [
            'United States'
        ],
        currency: 'USD',
        currencySymbol: '$',
        phoneFormat: ()=>`+1-${Math.floor(200 + Math.random() * 800)}-${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
        companies: [
            'Tech Corp',
            'Solutions Inc',
            'Digital Labs',
            'Cloud Systems',
            'Data Analytics',
            'Nexus Group',
            'Prime Services',
            'Global Ventures',
            'Alpha Technologies',
            'Beta Software'
        ],
        domains: [
            'gmail.com',
            'yahoo.com',
            'hotmail.com',
            'outlook.com',
            'company.com'
        ],
        streets: [
            'Main St',
            'Oak Ave',
            'Maple Dr',
            'Park Blvd',
            'Elm St',
            'Cedar Ln',
            'Pine Rd',
            'River Way',
            'Lake Dr',
            'Hill Rd'
        ]
    },
    'pk': {
        firstNames: [
            'Muhammad',
            'Ahmed',
            'Ali',
            'Usman',
            'Hassan',
            'Ibrahim',
            'Omar',
            'Bilal',
            'Tariq',
            'Asif',
            'Imran',
            'Kamran',
            'Zubair',
            'Sajid',
            'Adnan',
            'Fatima',
            'Ayesha',
            'Zainab',
            'Sana',
            'Hira',
            'Nadia',
            'Rabia',
            'Amna',
            'Sara',
            'Mehwish',
            'Uzma',
            'Sobia',
            'Rukhsana',
            'Nasreen',
            'Parveen'
        ],
        lastNames: [
            'Khan',
            'Ahmed',
            'Malik',
            'Sheikh',
            'Chaudhry',
            'Butt',
            'Mirza',
            'Hussain',
            'Qureshi',
            'Siddiqui',
            'Hashmi',
            'Abbasi',
            'Rajput',
            'Rana',
            'Cheema',
            'Baig',
            'Shaikh',
            'Ansari',
            'Farooqi',
            'Zaidi'
        ],
        cities: [
            'Karachi',
            'Lahore',
            'Islamabad',
            'Rawalpindi',
            'Faisalabad',
            'Multan',
            'Peshawar',
            'Quetta',
            'Gujranwala',
            'Sialkot',
            'Hyderabad',
            'Bahawalpur',
            'Sargodha',
            'Sukkur',
            'Larkana'
        ],
        countries: [
            'Pakistan'
        ],
        currency: 'PKR',
        currencySymbol: 'Rs.',
        phoneFormat: ()=>`+92-${Math.floor(300 + Math.random() * 100)}-${Math.floor(1000000 + Math.random() * 9000000)}`,
        companies: [
            'TechPk Ltd',
            'Karachi Traders',
            'Punjab Enterprises',
            'Sindh Solutions',
            'Pakistan Digital',
            'Ravi Tech',
            'Indus Systems',
            'Margalla IT',
            'Al-Rehman Group',
            'Pak Ventures'
        ],
        domains: [
            'gmail.com',
            'yahoo.com',
            'hotmail.com',
            'company.com.pk',
            'gmail.pk'
        ],
        streets: [
            'Model Town',
            'DHA Phase',
            'Gulshan-e-Iqbal',
            'Blue Area',
            'F-7',
            'G-10',
            'Clifton Block',
            'Garden Town',
            'Johar Town',
            'Cantt Area'
        ]
    }
};
function getLocaleKey(locale) {
    if (locale === 'pk' || locale.toLowerCase().includes('pakistan') || locale.toLowerCase() === 'ur') return 'pk';
    return 'en-US';
}
function generateFieldValue(field, rng, locale, rowIndex, allGeneratedData) {
    const ld = LOCALE_DATA[locale];
    // Handle null injection
    const nullRate = field.nullRate ?? (field.nullable ? 0.05 : 0);
    if (nullRate > 0 && rng.chance(nullRate)) return null;
    // Foreign key resolution
    if (field.foreignKey && allGeneratedData) {
        const [refTable, refField] = field.foreignKey.split('.');
        const refRows = allGeneratedData[refTable];
        if (refRows && refRows.length > 0) {
            return rng.pick(refRows)[refField];
        }
    }
    switch(field.type){
        case 'id':
        case 'integer':
            if (field.primaryKey) return rowIndex + 1;
            return rng.int(field.min ?? 1, field.max ?? 10000);
        case 'uuid':
            return `${hex(rng)}-${hex(rng, 4)}-4${hex(rng, 3)}-${hex(rng, 4)}-${hex(rng, 12)}`;
        case 'float':
            return rng.float(field.min ?? 0, field.max ?? 1000);
        case 'boolean':
            return rng.chance(0.5);
        case 'name':
            return `${rng.pick(ld.firstNames)} ${rng.pick(ld.lastNames)}`;
        case 'first_name':
            return rng.pick(ld.firstNames);
        case 'last_name':
            return rng.pick(ld.lastNames);
        case 'email':
            {
                const fn = rng.pick(ld.firstNames).toLowerCase();
                const ln = rng.pick(ld.lastNames).toLowerCase();
                return `${fn}.${ln}${rng.int(1, 999)}@${rng.pick(ld.domains)}`;
            }
        case 'phone':
            return ld.phoneFormat();
        case 'city':
            return rng.pick(ld.cities);
        case 'country':
            return ld.countries[0];
        case 'address':
            return `${rng.int(1, 9999)} ${rng.pick(ld.streets)}, ${rng.pick(ld.cities)}`;
        case 'company':
            return rng.pick(ld.companies);
        case 'date':
            {
                const start = new Date('2020-01-01').getTime();
                const end = new Date('2026-09-30').getTime();
                return new Date(start + rng.next() * (end - start)).toISOString().split('T')[0];
            }
        case 'datetime':
        case 'timestamp':
            {
                const start = new Date('2020-01-01').getTime();
                const end = new Date('2026-09-30').getTime();
                return new Date(start + rng.next() * (end - start)).toISOString();
            }
        case 'currency':
        case 'price':
            return rng.float(field.min ?? 1, field.max ?? 10000, 2);
        case 'salary':
            return rng.float(field.min ?? 30000, field.max ?? 200000, 0);
        case 'categorical':
        case 'status':
            {
                const cats = field.categories ?? [
                    'active',
                    'inactive',
                    'pending'
                ];
                return rng.pick(cats);
            }
        case 'gender':
            return rng.pick([
                'Male',
                'Female'
            ]);
        case 'role':
            {
                const roles = field.categories ?? [
                    'Admin',
                    'Manager',
                    'User',
                    'Viewer',
                    'Editor'
                ];
                return rng.pick(roles);
            }
        case 'url':
            return `https://${rng.pick([
                'www',
                'app',
                'api',
                'data'
            ])}.example.com/${rng.int(100, 999)}`;
        case 'ip':
            return `${rng.int(1, 254)}.${rng.int(0, 255)}.${rng.int(0, 255)}.${rng.int(1, 254)}`;
        case 'description':
        case 'text':
        case 'string':
            {
                const words = [
                    'quality',
                    'premium',
                    'standard',
                    'advanced',
                    'enhanced',
                    'professional',
                    'reliable',
                    'trusted',
                    'certified',
                    'verified'
                ];
                return `${rng.pick(words)} ${field.name.replace(/_/g, ' ')} ${rng.int(100, 9999)}`;
            }
        default:
            return `${field.name}_${rowIndex + 1}`;
    }
}
function hex(rng, len = 8) {
    return Array.from({
        length: len
    }, ()=>Math.floor(rng.next() * 16).toString(16)).join('');
}
function generateTable(schema, locale, allGeneratedData) {
    const rng = new SeededRandom(schema.seed ?? 42);
    const localeKey = getLocaleKey(locale);
    const rows = [];
    // Track unique values per field
    const uniqueSets = new Map();
    schema.fields.filter((f)=>f.unique || f.primaryKey).forEach((f)=>uniqueSets.set(f.name, new Set()));
    for(let i = 0; i < schema.rows; i++){
        const row = {};
        for (const field of schema.fields){
            let value;
            let attempts = 0;
            const uniqueSet = uniqueSets.get(field.name);
            do {
                value = generateFieldValue(field, rng, localeKey, i, allGeneratedData);
                attempts++;
            }while (uniqueSet && uniqueSet.has(value) && attempts < 100)
            if (uniqueSet) uniqueSet.add(value);
            // Apply prefix
            if (field.prefix && value !== null && value !== undefined) {
                value = `${field.prefix}${String(value).padStart(4, '0')}`;
            }
            row[field.name] = value;
        }
        rows.push(row);
    }
    return rows;
}
function inferFieldType(name, sampleValues) {
    const n = name.toLowerCase();
    // Name detection
    if (n === 'id' || n.endsWith('_id') || n === 'pk') return 'id';
    if (n.includes('uuid') || n.includes('guid')) return 'uuid';
    if (n.includes('email')) return 'email';
    if (n.includes('phone') || n.includes('mobile') || n.includes('tel')) return 'phone';
    if (n === 'name' || n.includes('full_name') || n.includes('fullname')) return 'name';
    if (n.includes('first_name') || n === 'firstname' || n === 'fname') return 'first_name';
    if (n.includes('last_name') || n === 'lastname' || n === 'lname') return 'last_name';
    if (n.includes('city')) return 'city';
    if (n.includes('country')) return 'country';
    if (n.includes('address') || n.includes('street')) return 'address';
    if (n.includes('company') || n.includes('employer') || n.includes('organisation')) return 'company';
    if (n.includes('salary') || n === 'wage' || n === 'income') return 'salary';
    if (n.includes('price') || n.includes('amount') || n.includes('total') || n.includes('cost') || n.includes('revenue')) return 'price';
    if (n.includes('date') && (n.includes('time') || n.includes('at'))) return 'datetime';
    if (n.includes('date') || n.includes('_on') || n === 'dob' || n.includes('birthday')) return 'date';
    if (n.includes('status')) return 'status';
    if (n.includes('gender') || n.includes('sex')) return 'gender';
    if (n.includes('role') || n.includes('type') || n.includes('category') || n.includes('tier')) return 'categorical';
    if (n.includes('description') || n.includes('notes') || n.includes('comment')) return 'description';
    if (n.includes('url') || n.includes('website') || n.includes('link')) return 'url';
    if (n.includes('ip') || n === 'ipaddress') return 'ip';
    if (n.includes('bool') || n.includes('is_') || n.includes('has_') || n.includes('active') || n.includes('enabled')) return 'boolean';
    // Sample value-based inference
    if (sampleValues.length > 0) {
        const sample = sampleValues[0];
        if (typeof sample === 'boolean') return 'boolean';
        if (typeof sample === 'number') {
            return Number.isInteger(sample) ? 'integer' : 'float';
        }
        if (typeof sample === 'string') {
            if (/^\d{4}-\d{2}-\d{2}T/.test(sample)) return 'datetime';
            if (/^\d{4}-\d{2}-\d{2}$/.test(sample)) return 'date';
            if (/^[\d.]+$/.test(sample)) return 'float';
            if (/^\d+$/.test(sample)) return 'integer';
        }
    }
    return 'string';
}
function inferPrimaryKey(headers) {
    const pkCandidates = [
        'id',
        'pk',
        '_id',
        'uuid',
        'guid'
    ];
    for (const h of headers){
        if (pkCandidates.includes(h.toLowerCase())) return h;
        if (h.toLowerCase().endsWith('_id') && h.toLowerCase() === h.split('_')[0] + '_id') {
        // e.g. "customer_id" in a "customers" table is not necessarily a PK
        }
    }
    return null;
}
function inferForeignKeys(tables) {
    const fks = {}; // fieldName → 'TableName.pk'
    const tableNames = tables.map((t)=>t.name.toLowerCase());
    for (const table of tables){
        for (const header of table.headers){
            const h = header.toLowerCase();
            if (h.endsWith('_id')) {
                const refName = h.replace(/_id$/, '');
                // Check if any table name matches
                const matchedIdx = tableNames.findIndex((tn)=>tn === refName || tn === refName + 's' || tn.startsWith(refName));
                if (matchedIdx !== -1) {
                    fks[`${table.name}.${header}`] = `${tables[matchedIdx].name}.id`;
                }
            }
        }
    }
    return fks;
}
function validateTabularData(data, schema, constraints) {
    const checks = [];
    if (!Array.isArray(data) || data.length === 0) {
        return {
            passed: false,
            checks: [
                {
                    name: 'Data Presence',
                    status: 'FAIL',
                    detail: 'No data was generated'
                }
            ],
            summary: {
                total: 1,
                passed: 0,
                failed: 1,
                warnings: 0,
                nullRate: 0,
                uniquenessScore: 0,
                overallScore: 0
            }
        };
    }
    // 1. Schema Validity
    const actualKeys = Object.keys(data[0]);
    const missingFields = schema.fields.filter((f)=>!actualKeys.includes(f.name)).map((f)=>f.name);
    checks.push({
        name: 'Schema Validity',
        status: missingFields.length === 0 ? 'PASS' : 'FAIL',
        detail: missingFields.length === 0 ? 'All expected columns present' : `Missing columns: ${missingFields.join(', ')}`
    });
    // 2. Primary Key Integrity
    const pkFields = schema.fields.filter((f)=>f.primaryKey);
    for (const pkField of pkFields){
        const pkValues = data.map((r)=>r[pkField.name]);
        const nullPKs = pkValues.filter((v)=>v === null || v === undefined).length;
        const uniquePKs = new Set(pkValues).size;
        const isValid = nullPKs === 0 && uniquePKs === data.length;
        checks.push({
            name: `PK Integrity: ${pkField.name}`,
            status: isValid ? 'PASS' : 'FAIL',
            detail: isValid ? `${uniquePKs} unique non-null values` : `${nullPKs} nulls, ${data.length - uniquePKs} duplicates`,
            metric: `${uniquePKs}/${data.length} unique`
        });
    }
    // 3. Null Rate
    let totalCells = 0, nullCells = 0;
    for (const row of data){
        for (const val of Object.values(row)){
            totalCells++;
            if (val === null || val === undefined) nullCells++;
        }
    }
    const nullRate = totalCells > 0 ? nullCells / totalCells : 0;
    checks.push({
        name: 'Null Rate',
        status: nullRate > 0.3 ? 'WARN' : 'PASS',
        detail: `${(nullRate * 100).toFixed(1)}% of cells are null`,
        metric: `${(nullRate * 100).toFixed(1)}%`
    });
    // 4. Type Compliance (sample check)
    let typeViolations = 0;
    for (const field of schema.fields){
        for (const row of data.slice(0, 20)){
            const val = row[field.name];
            if (val === null || val === undefined) continue;
            if ((field.type === 'integer' || field.type === 'id') && typeof val !== 'number' && !/^\d+$/.test(String(val))) {
                typeViolations++;
            }
            if (field.type === 'email' && typeof val === 'string' && !val.includes('@')) {
                typeViolations++;
            }
        }
    }
    checks.push({
        name: 'Type Compliance',
        status: typeViolations === 0 ? 'PASS' : 'WARN',
        detail: typeViolations === 0 ? 'All sampled values match expected types' : `${typeViolations} type violations in sample`
    });
    // 5. Constraint Checks
    if (constraints && constraints.length > 0) {
        for (const constraint of constraints){
            let violations = 0;
            for (const row of data){
                try {
                    const result = evaluateConstraint(constraint, row);
                    if (!result) violations++;
                } catch  {
                    violations++;
                }
            }
            checks.push({
                name: `Constraint: ${constraint}`,
                status: violations === 0 ? 'PASS' : 'FAIL',
                detail: violations === 0 ? 'All rows comply' : `${violations}/${data.length} violations`,
                metric: `${((data.length - violations) / data.length * 100).toFixed(1)}% compliant`
            });
        }
    }
    // Summary
    const passed = checks.filter((c)=>c.status === 'PASS').length;
    const failed = checks.filter((c)=>c.status === 'FAIL').length;
    const warnings = checks.filter((c)=>c.status === 'WARN').length;
    // Uniqueness score: fraction of fields with high uniqueness
    const uniquenessScore = pkFields.length > 0 ? checks.find((c)=>c.name.startsWith('PK'))?.status === 'PASS' ? 1 : 0 : 1;
    const overallScore = Math.round((passed + warnings * 0.5) / checks.length * 100);
    return {
        passed: failed === 0,
        checks,
        summary: {
            total: checks.length,
            passed,
            failed,
            warnings,
            nullRate: parseFloat((nullRate * 100).toFixed(1)),
            uniquenessScore: Math.round(uniquenessScore * 100),
            overallScore
        }
    };
}
function validateRelationalData(data, fkMap) {
    const checks = [];
    // FK integrity checks
    for (const [fkPath, pkPath] of Object.entries(fkMap)){
        const [fkTable, fkField] = fkPath.split('.');
        const [pkTable, pkField] = pkPath.split('.');
        const fkData = data[fkTable] || data[fkTable.toLowerCase()];
        const pkData = data[pkTable] || data[pkTable.toLowerCase()];
        if (!fkData || !pkData) {
            checks.push({
                name: `FK: ${fkPath}→${pkPath}`,
                status: 'SKIP',
                detail: 'Table not found in generated data'
            });
            continue;
        }
        const pkValues = new Set(pkData.map((r)=>r[pkField]));
        const violations = fkData.filter((r)=>{
            const val = r[fkField];
            return val !== null && val !== undefined && !pkValues.has(val);
        });
        checks.push({
            name: `FK Integrity: ${fkPath} → ${pkPath}`,
            status: violations.length === 0 ? 'PASS' : 'FAIL',
            detail: violations.length === 0 ? `All ${fkData.length} rows reference valid ${pkTable} records` : `${violations.length} orphan records (no matching ${pkTable})`,
            metric: `${fkData.length - violations.length}/${fkData.length} valid`
        });
    }
    // Row count checks
    for (const [table, rows] of Object.entries(data)){
        checks.push({
            name: `Row Count: ${table}`,
            status: rows.length > 0 ? 'PASS' : 'WARN',
            detail: `${rows.length} rows generated`,
            metric: rows.length
        });
    }
    const passed = checks.filter((c)=>c.status === 'PASS').length;
    const failed = checks.filter((c)=>c.status === 'FAIL').length;
    const warnings = checks.filter((c)=>c.status === 'WARN').length;
    const overallScore = checks.length > 0 ? Math.round((passed + warnings * 0.5) / checks.length * 100) : 0;
    return {
        passed: failed === 0,
        checks,
        summary: {
            total: checks.length,
            passed,
            failed,
            warnings,
            nullRate: 0,
            uniquenessScore: 100,
            overallScore
        }
    };
}
function evaluateConstraint(constraint, row) {
    // Simple constraint evaluator: replace field names with values and eval
    // Supported: field >= value, field > value, field <= value, field < value, field != null
    const expr = constraint.replace(/([a-zA-Z_][a-zA-Z0-9_]*)/g, (match)=>{
        if (match in row) {
            const val = row[match];
            if (val === null || val === undefined) return 'null';
            if (typeof val === 'string') return `"${val}"`;
            return String(val);
        }
        return match;
    });
    try {
        // eslint-disable-next-line no-new-func
        return Boolean(new Function(`return (${expr})`)());
    } catch  {
        return true; // Skip unparseable constraints
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0ttbil-._.js.map