import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Article from './models/Article.js';
import Quiz from './models/Quiz.js';

dotenv.config();

const sampleArticles = [
    {
        title: "Understanding Your Fundamental Rights Under the Indian Constitution",
        content: `The Constitution of India guarantees six fundamental rights to all its citizens. These rights are essential for the overall development of individuals and the nation.

Right to Equality (Articles 14-18): This ensures equality before law, prohibits discrimination on grounds of religion, race, caste, sex, or place of birth, and abolishes untouchability and titles.

Right to Freedom (Articles 19-22): This includes freedom of speech and expression, assembly, association, movement, residence, and profession. It also provides protection in respect of conviction for offenses and protection of life and personal liberty.

Right against Exploitation (Articles 23-24): This prohibits human trafficking, forced labor, and employment of children in factories and hazardous jobs.

Right to Freedom of Religion (Articles 25-28): This provides freedom of conscience and free profession, practice, and propagation of religion.

Right to Cultural and Educational Rights (Articles 29-30): This protects the interests of minorities by providing them the right to conserve their culture and establish educational institutions.

Right to Constitutional Remedies (Article 32): This empowers citizens to move to the Supreme Court for enforcement of fundamental rights.

These rights form the cornerstone of Indian democracy and ensure that every citizen can live with dignity and freedom. Understanding these rights is crucial for every Indian citizen to protect themselves and others from injustice.`,
        summary: "Learn about the six fundamental rights guaranteed by the Indian Constitution and how they protect every citizen's freedom and dignity.",
        category: "Constitutional Law",
        tags: ["Fundamental Rights", "Constitution", "Indian Law", "Civil Rights"],
        author: "Legal Awareness Team",
        imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800",
        readTime: 8,
        views: 1250,
        likes: 89,
        published: true
    },
    {
        title: "Consumer Rights: What Every Buyer Should Know",
        content: `The Consumer Protection Act, 2019 provides comprehensive protection to consumers in India. Every consumer has certain basic rights that protect them from unfair trade practices.

Right to Safety: Protection against goods and services that are hazardous to life and property. Consumers have the right to expect that products are safe for use.

Right to Information: Consumers have the right to be informed about the quality, quantity, potency, purity, standard, and price of goods or services. This helps in making informed choices.

Right to Choose: Consumers have the right to choose from a variety of goods and services at competitive prices. No seller can force a consumer to buy a particular product.

Right to be Heard: Consumers have the right to be heard and assured that their interests will receive due consideration at appropriate forums.

Right to Seek Redressal: Consumers have the right to seek redressal against unfair trade practices or unscrupulous exploitation. Consumer courts have been established for this purpose.

Right to Consumer Education: Consumers have the right to acquire knowledge and skills to be informed consumers throughout life.

How to File a Consumer Complaint:
1. Gather all relevant documents (bills, receipts, warranty cards)
2. Send a legal notice to the seller/manufacturer
3. If not resolved, file a complaint with the Consumer Forum
4. District Forum (for claims up to ₹1 crore)
5. State Commission (for claims between ₹1-10 crore)
6. National Commission (for claims above ₹10 crore)

Remember, an informed consumer is a protected consumer. Always keep your purchase receipts and warranty documents safe.`,
        summary: "Understand your consumer rights and learn how to protect yourself from unfair trade practices and seek redressal for grievances.",
        category: "Consumer Rights",
        tags: ["Consumer Protection", "Rights", "Legal Remedies", "Shopping"],
        author: "Consumer Rights Expert",
        imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800",
        readTime: 10,
        views: 2100,
        likes: 156,
        published: true
    },
    {
        title: "Women's Rights and Legal Protection in India",
        content: `Indian law provides comprehensive protection to women through various acts and provisions. Understanding these rights is crucial for women's empowerment.

Protection from Domestic Violence:
The Protection of Women from Domestic Violence Act, 2005 protects women from physical, emotional, sexual, verbal, and economic abuse. Women can file complaints and seek protection orders.

Workplace Rights:
The Sexual Harassment of Women at Workplace Act, 2013 mandates every organization to have an Internal Complaints Committee. Women can file complaints against harassment at work.

Property Rights:
Women have equal rights to ancestral property. The Hindu Succession Act gives daughters equal rights as sons in ancestral property.

Maternity Benefits:
The Maternity Benefit Act provides 26 weeks of paid leave to pregnant women and protects them from dismissal during pregnancy.

Right to Education:
The Right to Education Act ensures free and compulsory education for girls up to 14 years.

Protection from Dowry:
The Dowry Prohibition Act makes giving and taking dowry a criminal offense punishable with imprisonment and fine.

Legal Aid:
Women can access free legal aid through Legal Services Authorities for cases related to their rights.

Important Helplines:
- Women Helpline: 1091
- National Commission for Women: 011-26942369
- Domestic Violence Helpline: 181

Every woman should be aware of these rights and not hesitate to seek legal help when needed.`,
        summary: "Comprehensive guide to women's rights in India, including protection from violence, workplace rights, and legal remedies available.",
        category: "Civil Rights",
        tags: ["Women's Rights", "Gender Equality", "Legal Protection", "Empowerment"],
        author: "Women's Rights Advocate",
        imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800",
        readTime: 12,
        views: 3400,
        likes: 278,
        published: true
    },
    {
        title: "Understanding Criminal Law: Your Rights When Arrested",
        content: `Knowing your rights during arrest is crucial. The Indian Constitution and Criminal Procedure Code provide several protections to arrested persons.

Right to Know Grounds of Arrest:
Every person arrested must be informed of the grounds of arrest. The arresting officer must tell you why you are being arrested.

Right to Bail:
For bailable offenses, you have the right to be released on bail. For non-bailable offenses, you can apply for bail before a magistrate.

Right to Remain Silent:
You have the right to remain silent and not answer questions that may incriminate you. You cannot be forced to confess.

Right to Legal Representation:
You have the right to consult and be defended by a lawyer of your choice. If you cannot afford one, the state will provide free legal aid.

Right to Medical Examination:
You have the right to be examined by a doctor, especially if you allege torture or ill-treatment.

Right to be Produced Before Magistrate:
You must be produced before a magistrate within 24 hours of arrest (excluding travel time).

Rights During Interrogation:
- Cannot be interrogated at night (sunset to sunrise) unless in exceptional circumstances
- Women cannot be arrested after sunset and before sunrise
- Interrogation must be conducted in the presence of a lawyer if you request

Rights of Undertrial Prisoners:
- Right to free legal aid
- Right to speedy trial
- Right to humane treatment
- Right to meet family members

Remember: Arrest does not mean guilt. Everyone is presumed innocent until proven guilty in a court of law.`,
        summary: "Essential guide to your legal rights during arrest, interrogation, and detention under Indian criminal law.",
        category: "Criminal Law",
        tags: ["Arrest Rights", "Criminal Procedure", "Legal Rights", "Police"],
        author: "Criminal Law Expert",
        imageUrl: "https://images.unsplash.com/photo-1589391886645-d51941baf7fb?w=800",
        readTime: 15,
        views: 4200,
        likes: 312,
        published: true
    },
    {
        title: "Property Rights: Inheritance and Succession Laws",
        content: `Understanding property rights and succession laws is essential for protecting your family's assets and ensuring smooth transfer of property.

Hindu Succession Act, 1956:
This act governs inheritance among Hindus, Buddhists, Jains, and Sikhs. Key provisions include:
- Sons and daughters have equal rights to ancestral property
- Daughters have coparcenary rights (equal rights as sons)
- Self-acquired property can be willed to anyone

Muslim Personal Law:
Muslim inheritance is governed by Sharia law. Key points:
- Sons inherit twice the share of daughters
- Widow gets 1/8th if there are children, 1/4th if no children
- Parents also have inheritance rights

Christian Succession:
Governed by the Indian Succession Act, 1925:
- If there's a will, property is distributed accordingly
- Without a will, property is divided among legal heirs
- Widow gets 1/3rd, children get 2/3rd

Making a Valid Will:
1. Must be in writing
2. Signed by the testator (person making the will)
3. Witnessed by at least two people
4. Sound mind and not under coercion
5. Can be changed or revoked anytime

Partition of Property:
Joint family property can be partitioned. Each coparcener can demand their share. Partition can be done by:
- Mutual agreement
- Court decree
- Arbitration

Registration of Property:
Always register property transfers to avoid disputes. Registration provides legal proof of ownership.

Important: Consult a lawyer for property matters to ensure all legal requirements are met.`,
        summary: "Complete guide to property rights, inheritance laws, and succession for different religions in India.",
        category: "Property Law",
        tags: ["Property Rights", "Inheritance", "Succession", "Will"],
        author: "Property Law Specialist",
        imageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800",
        readTime: 14,
        views: 2800,
        likes: 198,
        published: true
    },
    {
        title: "Labor Laws: Know Your Rights as an Employee",
        content: `Every employee in India is protected by comprehensive labor laws. Understanding these rights helps ensure fair treatment at the workplace.

Minimum Wages Act, 1948:
Employers must pay at least the minimum wage fixed by the government. This varies by state and industry. Non-payment is a criminal offense.

Payment of Wages Act, 1936:
- Wages must be paid on time (within 7 days for <1000 employees, 10 days for others)
- Deductions can only be made for specific reasons
- Fines cannot exceed 3% of wages

Working Hours and Overtime:
- Maximum 9 hours per day, 48 hours per week
- Overtime must be paid at double the rate
- Weekly holiday is mandatory

Leave Entitlements:
- Earned Leave: 1 day for every 20 days worked
- Casual Leave: As per company policy
- Sick Leave: As per company policy
- Maternity Leave: 26 weeks for women

Provident Fund (PF):
Mandatory for establishments with 20+ employees. Both employer and employee contribute 12% of basic salary.

Gratuity:
Payable after 5 years of continuous service. Formula: (Last drawn salary × 15/26) × number of years of service.

Employee State Insurance (ESI):
Medical insurance for employees earning up to ₹21,000/month. Covers employee and family.

Protection from Unfair Dismissal:
- Notice period must be given
- Retrenchment compensation for workers
- Cannot be dismissed for union activities

Sexual Harassment:
Every organization must have a complaints committee. Harassment is a punishable offense.

Contract Labor:
Contract workers are entitled to same wages and facilities as regular workers for the same work.

How to File Labor Complaints:
1. Approach the Labor Commissioner
2. File complaint with Labor Court
3. Contact trade unions
4. Use government portals like Shram Suvidha

Remember: Your labor rights are protected by law. Don't hesitate to seek legal help if they are violated.`,
        summary: "Comprehensive guide to employee rights in India, covering wages, working hours, benefits, and protection from unfair practices.",
        category: "Labor Law",
        tags: ["Employee Rights", "Labor Laws", "Workplace", "Wages"],
        author: "Labor Law Expert",
        imageUrl: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800",
        readTime: 16,
        views: 3600,
        likes: 245,
        published: true
    }
];

const sampleQuizzes = [
    {
        title: "Fundamental Rights Quiz",
        description: "Test your knowledge about fundamental rights guaranteed by the Indian Constitution",
        category: "Constitutional Law",
        difficulty: "Easy",
        timeLimit: 600,
        passingScore: 70,
        questions: [
            {
                question: "How many fundamental rights are guaranteed by the Indian Constitution?",
                options: ["Four", "Five", "Six", "Seven"],
                correctAnswer: 2,
                explanation: "The Indian Constitution guarantees six fundamental rights to all citizens."
            },
            {
                question: "Which Article of the Constitution provides the Right to Constitutional Remedies?",
                options: ["Article 19", "Article 21", "Article 32", "Article 14"],
                correctAnswer: 2,
                explanation: "Article 32 provides the Right to Constitutional Remedies, allowing citizens to approach the Supreme Court for enforcement of fundamental rights."
            },
            {
                question: "The Right to Education is a fundamental right under which Article?",
                options: ["Article 21A", "Article 19", "Article 15", "Article 29"],
                correctAnswer: 0,
                explanation: "Article 21A makes education a fundamental right for children aged 6-14 years."
            },
            {
                question: "Which fundamental right prohibits human trafficking and forced labor?",
                options: ["Right to Equality", "Right against Exploitation", "Right to Freedom", "Right to Life"],
                correctAnswer: 1,
                explanation: "Right against Exploitation (Articles 23-24) prohibits human trafficking, forced labor, and child labor."
            },
            {
                question: "Article 14 of the Constitution guarantees:",
                options: ["Freedom of Speech", "Equality before Law", "Right to Property", "Freedom of Religion"],
                correctAnswer: 1,
                explanation: "Article 14 guarantees equality before law and equal protection of laws to all persons."
            },
            {
                question: "The Right to Freedom of Religion is covered under which Articles?",
                options: ["Articles 14-18", "Articles 19-22", "Articles 25-28", "Articles 29-30"],
                correctAnswer: 2,
                explanation: "Articles 25-28 provide the Right to Freedom of Religion, including freedom of conscience and free profession, practice, and propagation of religion."
            },
            {
                question: "Which of the following is NOT a fundamental right?",
                options: ["Right to Equality", "Right to Property", "Right to Freedom", "Right against Exploitation"],
                correctAnswer: 1,
                explanation: "Right to Property was removed from fundamental rights by the 44th Amendment in 1978 and is now a constitutional right under Article 300A."
            },
            {
                question: "Article 21 guarantees:",
                options: ["Right to Education", "Protection of Life and Personal Liberty", "Freedom of Speech", "Right to Work"],
                correctAnswer: 1,
                explanation: "Article 21 states that no person shall be deprived of life or personal liberty except according to procedure established by law."
            },
            {
                question: "Untouchability is abolished under which Article?",
                options: ["Article 14", "Article 15", "Article 17", "Article 19"],
                correctAnswer: 2,
                explanation: "Article 17 abolishes untouchability and forbids its practice in any form."
            },
            {
                question: "The Right to Freedom of Speech and Expression is guaranteed under:",
                options: ["Article 19(1)(a)", "Article 21", "Article 14", "Article 32"],
                correctAnswer: 0,
                explanation: "Article 19(1)(a) guarantees all citizens the right to freedom of speech and expression."
            }
        ],
        published: true,
        attempts: 0
    },
    {
        title: "Consumer Rights Awareness Quiz",
        description: "How well do you know your rights as a consumer? Take this quiz to find out!",
        category: "Consumer Rights",
        difficulty: "Medium",
        timeLimit: 480,
        passingScore: 70,
        questions: [
            {
                question: "The Consumer Protection Act was enacted in which year?",
                options: ["2019", "2015", "1986", "2005"],
                correctAnswer: 0,
                explanation: "The Consumer Protection Act, 2019 replaced the earlier 1986 Act, providing enhanced protection to consumers."
            },
            {
                question: "What is the maximum claim amount for District Consumer Forum?",
                options: ["₹50 lakhs", "₹1 crore", "₹10 crore", "₹5 crore"],
                correctAnswer: 1,
                explanation: "District Consumer Forum handles claims up to ₹1 crore."
            },
            {
                question: "Which of the following is NOT a consumer right?",
                options: ["Right to Safety", "Right to Information", "Right to Profit", "Right to Choose"],
                correctAnswer: 2,
                explanation: "Right to Profit is not a consumer right. The six consumer rights are: Safety, Information, Choice, Representation, Redressal, and Consumer Education."
            },
            {
                question: "A consumer can file a complaint within how many years of the cause of action?",
                options: ["1 year", "2 years", "3 years", "5 years"],
                correctAnswer: 1,
                explanation: "A consumer complaint must be filed within 2 years from the date of cause of action."
            },
            {
                question: "The National Consumer Helpline number is:",
                options: ["1800-11-4000", "1091", "100", "1800-11-2345"],
                correctAnswer: 0,
                explanation: "The National Consumer Helpline number is 1800-11-4000 (toll-free)."
            },
            {
                question: "E-commerce transactions are covered under Consumer Protection Act, 2019:",
                options: ["Yes", "No", "Only for goods above ₹10,000", "Only for registered sellers"],
                correctAnswer: 0,
                explanation: "Yes, the Consumer Protection Act, 2019 specifically includes e-commerce transactions and provides protection for online purchases."
            },
            {
                question: "What does 'caveat emptor' mean?",
                options: ["Seller beware", "Buyer beware", "Consumer rights", "Fair trade"],
                correctAnswer: 1,
                explanation: "'Caveat emptor' is a Latin phrase meaning 'buyer beware', indicating that the buyer is responsible for checking the quality of goods before purchase."
            },
            {
                question: "The State Consumer Commission handles claims between:",
                options: ["₹1 crore to ₹10 crore", "₹50 lakhs to ₹1 crore", "₹10 crore to ₹50 crore", "Above ₹10 crore"],
                correctAnswer: 0,
                explanation: "State Consumer Commission handles claims between ₹1 crore and ₹10 crore."
            }
        ],
        published: true,
        attempts: 0
    },
    {
        title: "Criminal Law Basics Quiz",
        description: "Test your understanding of basic criminal law concepts and procedures in India",
        category: "Criminal Law",
        difficulty: "Hard",
        timeLimit: 720,
        passingScore: 75,
        questions: [
            {
                question: "An arrested person must be produced before a magistrate within:",
                options: ["12 hours", "24 hours", "48 hours", "72 hours"],
                correctAnswer: 1,
                explanation: "Article 22(2) of the Constitution mandates that an arrested person must be produced before a magistrate within 24 hours of arrest (excluding travel time)."
            },
            {
                question: "Which section of IPC deals with the Right to Private Defence?",
                options: ["Section 96-106", "Section 299-311", "Section 375-376", "Section 420-424"],
                correctAnswer: 0,
                explanation: "Sections 96 to 106 of the Indian Penal Code deal with the Right to Private Defence of body and property."
            },
            {
                question: "FIR stands for:",
                options: ["First Investigation Report", "First Information Report", "Final Investigation Report", "Formal Information Record"],
                correctAnswer: 1,
                explanation: "FIR stands for First Information Report, which is the first step in criminal proceedings."
            },
            {
                question: "Cognizable offense means:",
                options: ["Police can arrest without warrant", "Police need warrant to arrest", "Only serious crimes", "Bailable offenses"],
                correctAnswer: 0,
                explanation: "In cognizable offenses, police can arrest without a warrant and start investigation without permission from the court."
            },
            {
                question: "The maximum punishment for defamation under IPC is:",
                options: ["6 months", "1 year", "2 years", "3 years"],
                correctAnswer: 2,
                explanation: "Under Section 500 of IPC, defamation is punishable with simple imprisonment up to 2 years, or fine, or both."
            },
            {
                question: "Juvenile Justice Act applies to persons below the age of:",
                options: ["16 years", "18 years", "21 years", "14 years"],
                correctAnswer: 1,
                explanation: "The Juvenile Justice Act, 2015 applies to persons below 18 years of age."
            },
            {
                question: "Which of the following is a non-bailable offense?",
                options: ["Theft", "Murder", "Cheating", "Defamation"],
                correctAnswer: 1,
                explanation: "Murder is a non-bailable offense under IPC Section 302. Bail is not a matter of right and is at the discretion of the court."
            },
            {
                question: "The burden of proof in criminal cases lies with:",
                options: ["Accused", "Prosecution", "Judge", "Police"],
                correctAnswer: 1,
                explanation: "In criminal cases, the burden of proof lies with the prosecution to prove guilt beyond reasonable doubt."
            },
            {
                question: "Section 498A of IPC deals with:",
                options: ["Dowry death", "Cruelty by husband or relatives", "Rape", "Domestic violence"],
                correctAnswer: 1,
                explanation: "Section 498A deals with cruelty by husband or his relatives towards a married woman."
            },
            {
                question: "The principle 'Innocent until proven guilty' is based on:",
                options: ["Article 20", "Article 21", "Article 22", "Presumption of innocence"],
                correctAnswer: 3,
                explanation: "The presumption of innocence is a fundamental principle in criminal law that places the burden of proof on the prosecution."
            }
        ],
        published: true,
        attempts: 0
    },
    {
        title: "Women's Rights Quiz",
        description: "Test your knowledge about legal rights and protections available to women in India",
        category: "Civil Rights",
        difficulty: "Medium",
        timeLimit: 600,
        passingScore: 70,
        questions: [
            {
                question: "The Maternity Benefit Act provides how many weeks of paid leave?",
                options: ["12 weeks", "18 weeks", "26 weeks", "52 weeks"],
                correctAnswer: 2,
                explanation: "The Maternity Benefit (Amendment) Act, 2017 provides 26 weeks of paid maternity leave."
            },
            {
                question: "Women Helpline number in India is:",
                options: ["100", "1091", "181", "1098"],
                correctAnswer: 1,
                explanation: "1091 is the Women Helpline number in India for women in distress."
            },
            {
                question: "The Dowry Prohibition Act was enacted in:",
                options: ["1956", "1961", "1975", "1986"],
                correctAnswer: 1,
                explanation: "The Dowry Prohibition Act was enacted in 1961 to prohibit the giving or taking of dowry."
            },
            {
                question: "Sexual harassment at workplace is covered under which Act?",
                options: ["POSH Act, 2013", "IPC Section 354", "Domestic Violence Act", "Women's Charter"],
                correctAnswer: 0,
                explanation: "The Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013, also known as POSH Act, addresses sexual harassment at workplace."
            },
            {
                question: "Under Hindu Succession Act, daughters have coparcenary rights in:",
                options: ["Self-acquired property only", "Ancestral property only", "Both ancestral and self-acquired", "Neither"],
                correctAnswer: 1,
                explanation: "The 2005 amendment to Hindu Succession Act gave daughters equal coparcenary rights in ancestral property."
            },
            {
                question: "The legal age of marriage for women in India is:",
                options: ["16 years", "18 years", "21 years", "25 years"],
                correctAnswer: 1,
                explanation: "The legal age of marriage for women in India is 18 years under the Prohibition of Child Marriage Act, 2006."
            },
            {
                question: "Domestic Violence Act, 2005 protects women from:",
                options: ["Physical abuse only", "Emotional abuse only", "All forms of abuse", "Sexual abuse only"],
                correctAnswer: 2,
                explanation: "The Protection of Women from Domestic Violence Act, 2005 protects women from physical, emotional, sexual, verbal, and economic abuse."
            },
            {
                question: "Can a woman file a complaint of domestic violence against her husband's relatives?",
                options: ["Yes", "No", "Only against in-laws", "Only with husband's permission"],
                correctAnswer: 0,
                explanation: "Yes, the Domestic Violence Act allows women to file complaints against husband and his relatives."
            }
        ],
        published: true,
        attempts: 0
    },
    {
        title: "Property and Inheritance Laws Quiz",
        description: "Assess your understanding of property rights and inheritance laws in India",
        category: "Property Law",
        difficulty: "Medium",
        timeLimit: 540,
        passingScore: 70,
        questions: [
            {
                question: "A will can be changed or revoked:",
                options: ["Never", "Only once", "Anytime during lifetime", "Only with court permission"],
                correctAnswer: 2,
                explanation: "A will can be changed, modified, or revoked anytime during the lifetime of the testator."
            },
            {
                question: "How many witnesses are required for a valid will?",
                options: ["One", "Two", "Three", "Four"],
                correctAnswer: 1,
                explanation: "A valid will requires at least two witnesses who must sign in the presence of the testator."
            },
            {
                question: "Under Muslim law, a son inherits _____ the share of a daughter:",
                options: ["Equal to", "Double", "Triple", "Half"],
                correctAnswer: 1,
                explanation: "Under Muslim personal law, a son inherits double the share of a daughter."
            },
            {
                question: "Ancestral property is property that has been inherited for:",
                options: ["1 generation", "2 generations", "3 generations", "4 generations"],
                correctAnswer: 3,
                explanation: "Property becomes ancestral when it has been inherited for four generations without partition."
            },
            {
                question: "Registration of property is mandatory for:",
                options: ["All properties", "Properties above ₹100", "Sale, mortgage, lease above 1 year", "Only agricultural land"],
                correctAnswer: 2,
                explanation: "Registration is mandatory for sale, mortgage, and lease of immovable property for more than one year."
            },
            {
                question: "Partition of joint family property can be demanded by:",
                options: ["Only eldest son", "Any coparcener", "Only father", "Only with everyone's consent"],
                correctAnswer: 1,
                explanation: "Any coparcener can demand partition of joint family property as it is their legal right."
            },
            {
                question: "If a person dies without a will, the property is distributed according to:",
                options: ["Court's decision", "Succession laws", "Government rules", "Family agreement"],
                correctAnswer: 1,
                explanation: "When a person dies intestate (without a will), property is distributed according to succession laws applicable to their religion."
            },
            {
                question: "A Hindu woman's self-acquired property can be willed to:",
                options: ["Only her children", "Only her husband", "Anyone she chooses", "Only blood relatives"],
                correctAnswer: 2,
                explanation: "A Hindu woman has absolute rights over her self-acquired property and can will it to anyone she chooses."
            }
        ],
        published: true,
        attempts: 0
    }
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('📦 Connected to MongoDB');

        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await Article.deleteMany({});
        await Quiz.deleteMany({});

        // Insert sample articles
        console.log('📝 Inserting sample articles...');
        await Article.insertMany(sampleArticles);
        console.log(`✅ Inserted ${sampleArticles.length} articles`);

        // Insert sample quizzes
        console.log('🧠 Inserting sample quizzes...');
        await Quiz.insertMany(sampleQuizzes);
        console.log(`✅ Inserted ${sampleQuizzes.length} quizzes`);

        console.log('🎉 Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
