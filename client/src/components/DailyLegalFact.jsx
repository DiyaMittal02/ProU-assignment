import { useState, useEffect } from 'react';
import { Lightbulb, RefreshCw, Calendar } from 'lucide-react';
import './DailyLegalFact.css';

const DailyLegalFact = () => {
    const [fact, setFact] = useState(null);
    const [loading, setLoading] = useState(true);

    // Array of legal facts - rotates daily
    const legalFacts = [
        {
            title: "Right to Education",
            fact: "Article 21A of the Indian Constitution makes education a fundamental right for children aged 6-14 years. The Right to Education Act, 2009 ensures free and compulsory education.",
            category: "Fundamental Rights",
            icon: "📚"
        },
        {
            title: "Right to Information",
            fact: "The RTI Act, 2005 empowers citizens to request information from public authorities. Any citizen can file an RTI application for just ₹10.",
            category: "Citizen Rights",
            icon: "📋"
        },
        {
            title: "Consumer Protection",
            fact: "Under the Consumer Protection Act, consumers have the right to seek redressal against defective goods or deficient services within 2 years of purchase.",
            category: "Consumer Law",
            icon: "🛡️"
        },
        {
            title: "Right Against Exploitation",
            fact: "Article 23 prohibits human trafficking and forced labor. Article 24 prohibits employment of children below 14 years in factories and hazardous work.",
            category: "Fundamental Rights",
            icon: "⚖️"
        },
        {
            title: "Freedom of Speech",
            fact: "Article 19(1)(a) guarantees freedom of speech and expression, but it is subject to reasonable restrictions under Article 19(2) for security, public order, and decency.",
            category: "Fundamental Rights",
            icon: "🗣️"
        },
        {
            title: "Right to Privacy",
            fact: "In 2017, the Supreme Court declared privacy a fundamental right under Article 21. This includes informational, bodily, and decisional privacy.",
            category: "Fundamental Rights",
            icon: "🔒"
        },
        {
            title: "Equal Pay for Equal Work",
            fact: "Article 39(d) mandates equal pay for equal work for both men and women. Gender-based wage discrimination is unconstitutional.",
            category: "Labor Law",
            icon: "💰"
        },
        {
            title: "Right to Constitutional Remedies",
            fact: "Article 32 allows citizens to move the Supreme Court directly for enforcement of fundamental rights. Dr. Ambedkar called it the 'heart and soul' of the Constitution.",
            category: "Fundamental Rights",
            icon: "⚖️"
        },
        {
            title: "Domestic Violence Act",
            fact: "The Protection of Women from Domestic Violence Act, 2005 protects women from physical, emotional, sexual, and economic abuse in domestic relationships.",
            category: "Women's Rights",
            icon: "🛡️"
        },
        {
            title: "Right to Clean Environment",
            fact: "Article 21 has been interpreted to include the right to a clean and healthy environment. Pollution and environmental degradation violate this right.",
            category: "Environmental Law",
            icon: "🌱"
        },
        {
            title: "Juvenile Justice",
            fact: "The Juvenile Justice Act, 2015 treats persons under 18 as juveniles. They cannot be tried as adults except in heinous crimes committed by 16-18 year olds.",
            category: "Criminal Law",
            icon: "👶"
        },
        {
            title: "Right to Bail",
            fact: "In bailable offenses, bail is a right. In non-bailable offenses, it's at the court's discretion. The principle is 'bail, not jail' for undertrial prisoners.",
            category: "Criminal Law",
            icon: "⚖️"
        },
        {
            title: "Maternity Benefits",
            fact: "The Maternity Benefit Act, 2017 provides 26 weeks of paid maternity leave for women employees. Adoptive and commissioning mothers get 12 weeks.",
            category: "Labor Law",
            icon: "👶"
        },
        {
            title: "Right Against Arrest",
            fact: "Article 22 provides that every arrested person must be informed of grounds of arrest and has the right to consult a lawyer of their choice.",
            category: "Criminal Law",
            icon: "🚔"
        },
        {
            title: "Property Rights",
            fact: "While no longer a fundamental right, the right to property is a constitutional right under Article 300A. The state cannot deprive property except by law.",
            category: "Property Law",
            icon: "🏠"
        },
        {
            title: "Senior Citizens Rights",
            fact: "The Maintenance and Welfare of Parents and Senior Citizens Act, 2007 makes it mandatory for children to maintain their parents and senior citizens.",
            category: "Family Law",
            icon: "👴"
        },
        {
            title: "Right to Vote",
            fact: "Every Indian citizen above 18 years has the right to vote. However, voting is a constitutional right, not a fundamental right.",
            category: "Electoral Law",
            icon: "🗳️"
        },
        {
            title: "Sexual Harassment at Workplace",
            fact: "The Sexual Harassment of Women at Workplace Act, 2013 mandates every organization with 10+ employees to have an Internal Complaints Committee.",
            category: "Women's Rights",
            icon: "🚫"
        },
        {
            title: "Right to Legal Aid",
            fact: "Article 39A provides free legal aid to ensure justice is not denied due to economic or other disabilities. Legal Services Authorities Act, 1987 implements this.",
            category: "Legal Aid",
            icon: "⚖️"
        },
        {
            title: "Cyber Law",
            fact: "The IT Act, 2000 recognizes electronic records and digital signatures. Cyber crimes like hacking, identity theft, and cyberstalking are punishable offenses.",
            category: "Cyber Law",
            icon: "💻"
        },
        {
            title: "Right to Food",
            fact: "The National Food Security Act, 2013 provides subsidized food grains to approximately 75% of rural and 50% of urban population.",
            category: "Social Welfare",
            icon: "🍚"
        },
        {
            title: "Whistleblower Protection",
            fact: "The Whistleblowers Protection Act, 2014 protects persons making public interest disclosures about corruption or willful misuse of power.",
            category: "Anti-Corruption",
            icon: "📢"
        },
        {
            title: "Right to Equality",
            fact: "Article 14 guarantees equality before law and equal protection of laws. The state cannot deny any person equality before law within Indian territory.",
            category: "Fundamental Rights",
            icon: "⚖️"
        },
        {
            title: "Minimum Wages",
            fact: "The Minimum Wages Act, 1948 ensures workers receive minimum wages fixed by the government. Non-payment is a criminal offense punishable with imprisonment.",
            category: "Labor Law",
            icon: "💵"
        },
        {
            title: "Right to Protest",
            fact: "Peaceful protest is a fundamental right under Article 19(1)(b) - right to assemble peacefully without arms. However, it's subject to reasonable restrictions.",
            category: "Fundamental Rights",
            icon: "✊"
        },
        {
            title: "Trademark Protection",
            fact: "The Trademarks Act, 1999 protects brand names and logos. A registered trademark is valid for 10 years and can be renewed indefinitely.",
            category: "Intellectual Property",
            icon: "™️"
        },
        {
            title: "Right to Speedy Trial",
            fact: "Article 21 includes the right to speedy trial. Unreasonable delay in trial can be a ground for quashing proceedings or reducing sentence.",
            category: "Criminal Law",
            icon: "⏱️"
        },
        {
            title: "Child Rights",
            fact: "The Protection of Children from Sexual Offences (POCSO) Act, 2012 provides stringent punishment for sexual abuse of children below 18 years.",
            category: "Child Rights",
            icon: "👶"
        },
        {
            title: "Copyright Law",
            fact: "Copyright protection in India lasts for the lifetime of the author plus 60 years. It covers literary, dramatic, musical, and artistic works.",
            category: "Intellectual Property",
            icon: "©️"
        },
        {
            title: "Right to Compensation",
            fact: "Victims of crime have the right to compensation under Section 357A CrPC. The state must establish victim compensation schemes.",
            category: "Victim Rights",
            icon: "💰"
        }
    ];

    useEffect(() => {
        loadDailyFact();
    }, []);

    const loadDailyFact = () => {
        setLoading(true);
        // Get fact based on current date (changes daily)
        const today = new Date();
        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
        const factIndex = dayOfYear % legalFacts.length;

        setTimeout(() => {
            setFact(legalFacts[factIndex]);
            setLoading(false);
        }, 500);
    };

    const handleRefresh = () => {
        // Show next fact
        const currentIndex = legalFacts.findIndex(f => f.title === fact?.title);
        const nextIndex = (currentIndex + 1) % legalFacts.length;
        setLoading(true);
        setTimeout(() => {
            setFact(legalFacts[nextIndex]);
            setLoading(false);
        }, 500);
    };

    if (loading) {
        return (
            <div className="daily-legal-fact card">
                <div className="fact-header">
                    <Lightbulb size={24} />
                    <h3>Daily Legal Fact</h3>
                </div>
                <div className="fact-loading">
                    <div className="spinner"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="daily-legal-fact card">
            <div className="fact-header">
                <div className="fact-header-left">
                    <Lightbulb size={24} className="fact-icon" />
                    <h3>Daily Legal Fact</h3>
                </div>
                <button onClick={handleRefresh} className="refresh-button" title="Next fact">
                    <RefreshCw size={18} />
                </button>
            </div>

            {fact && (
                <div className="fact-content">
                    <div className="fact-category">
                        <span className="category-icon">{fact.icon}</span>
                        <span className="category-name">{fact.category}</span>
                    </div>

                    <h4 className="fact-title">{fact.title}</h4>
                    <p className="fact-text">{fact.fact}</p>

                    <div className="fact-footer">
                        <Calendar size={14} />
                        <span>Updated {new Date().toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                        })}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DailyLegalFact;
