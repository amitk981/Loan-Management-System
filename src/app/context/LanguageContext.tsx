import { createContext, ReactNode, useContext, useState } from 'react';

export type AppLanguage = 'EN' | 'मर' | 'हि';

interface LanguageContextType {
  lang: AppLanguage;
  setLang: (lang: AppLanguage) => void;
  t: (key: string, fallback: string) => string;
}

const dictionary: Record<AppLanguage, Record<string, string>> = {
  EN: {},
  'मर': {
    'app.search': 'कर्ज आणि सदस्य शोधा',
    'app.notifications': 'सूचना',
    'app.profile': 'माझी प्रोफाइल',
    'app.logout': 'लॉगआउट',
    'app.viewAll': 'सर्व सूचना पहा',
    'nav.dashboard': 'डॅशबोर्ड',
    'nav.myDashboard': 'माझा डॅशबोर्ड',
    'nav.applyLoan': 'कर्ज अर्ज',
    'nav.myLoans': 'माझी कर्जे',
    'nav.activeLoans': 'सक्रिय कर्जे',
    'nav.loanHistory': 'कर्ज इतिहास',
    'nav.myDocuments': 'माझी कागदपत्रे',
    'nav.repayment': 'पेमेंट करा',
    'nav.support': 'मदत व तक्रार',
    'nav.applicationInbox': 'अर्ज इनबॉक्स',
    'nav.newApplications': 'नवीन अर्ज',
    'nav.pendingAppraisal': 'मूल्यांकन प्रलंबित',
    'nav.returned': 'अपूर्ण अर्ज',
    'nav.memberRegistry': 'सदस्य नोंदणी',
    'nav.searchMember': 'सदस्य शोध',
    'nav.memberProfile': 'सदस्य प्रोफाइल',
    'nav.loanRegister': 'कर्ज नोंदणी',
    'nav.loanCalculator': 'कर्ज गणक',
    'nav.analytics': 'पोर्टफोलिओ विश्लेषण',
    'nav.dpd': 'DPD अहवाल',
    'nav.defaults': 'थकबाकी व वसुली',
    'nav.documentQueue': 'दस्तऐवज रांग',
    'nav.templates': 'दस्तऐवज नमुने',
    'nav.kyc': 'KYC व CKYC',
    'nav.calendar': 'अनुपालन दिनदर्शिका',
    'nav.noc': 'NOC व्यवस्थापन',
    'nav.stamp': 'स्टॅम्प ड्यूटी नोंदणी',
    'nav.reports': 'अहवाल',
    'nav.approvalQueue': 'मंजुरी रांग',
    'nav.sanctionRegister': 'मंजुरी नोंदणी',
    'nav.exceptions': 'अपवाद नोंदणी',
    'nav.board': 'बोर्ड मिनिट्स',
    'nav.policy': 'धोरण सेटिंग्ज',
    'nav.disbursement': 'वितरण रांग',
    'nav.sap': 'SAP व्यवस्थापन',
    'nav.incoming': 'प्राप्त पेमेंट',
    'nav.userManagement': 'वापरकर्ता व्यवस्थापन',
    'nav.audit': 'ऑडिट लॉग',
    'nav.config': 'सिस्टम सेटिंग्ज',
  },
  'हि': {
    'app.search': 'ऋण और सदस्य खोजें',
    'app.notifications': 'सूचनाएं',
    'app.profile': 'मेरी प्रोफाइल',
    'app.logout': 'लॉगआउट',
    'app.viewAll': 'सभी सूचनाएं देखें',
    'nav.dashboard': 'डैशबोर्ड',
    'nav.myDashboard': 'मेरा डैशबोर्ड',
    'nav.applyLoan': 'ऋण आवेदन',
    'nav.myLoans': 'मेरे ऋण',
    'nav.activeLoans': 'सक्रिय ऋण',
    'nav.loanHistory': 'ऋण इतिहास',
    'nav.myDocuments': 'मेरे दस्तावेज',
    'nav.repayment': 'भुगतान करें',
    'nav.support': 'सहायता और शिकायत',
    'nav.applicationInbox': 'आवेदन इनबॉक्स',
    'nav.newApplications': 'नए आवेदन',
    'nav.pendingAppraisal': 'मूल्यांकन लंबित',
    'nav.returned': 'अधूरे आवेदन',
    'nav.memberRegistry': 'सदस्य रजिस्ट्री',
    'nav.searchMember': 'सदस्य खोज',
    'nav.memberProfile': 'सदस्य प्रोफाइल',
    'nav.loanRegister': 'ऋण रजिस्टर',
    'nav.loanCalculator': 'ऋण कैलकुलेटर',
    'nav.analytics': 'पोर्टफोलियो विश्लेषण',
    'nav.dpd': 'DPD रिपोर्ट',
    'nav.defaults': 'डिफॉल्ट और रिकवरी',
    'nav.documentQueue': 'दस्तावेज कतार',
    'nav.templates': 'दस्तावेज टेम्पलेट',
    'nav.kyc': 'KYC और CKYC',
    'nav.calendar': 'अनुपालन कैलेंडर',
    'nav.noc': 'NOC प्रबंधन',
    'nav.stamp': 'स्टाम्प ड्यूटी रजिस्टर',
    'nav.reports': 'रिपोर्ट',
    'nav.approvalQueue': 'स्वीकृति कतार',
    'nav.sanctionRegister': 'स्वीकृति रजिस्टर',
    'nav.exceptions': 'अपवाद रजिस्टर',
    'nav.board': 'बोर्ड मिनट्स',
    'nav.policy': 'नीति सेटिंग्स',
    'nav.disbursement': 'वितरण कतार',
    'nav.sap': 'SAP प्रबंधन',
    'nav.incoming': 'प्राप्त भुगतान',
    'nav.userManagement': 'उपयोगकर्ता प्रबंधन',
    'nav.audit': 'ऑडिट लॉग',
    'nav.config': 'सिस्टम सेटिंग्स',
  },
};

const LanguageContext = createContext<LanguageContextType>({
  lang: 'EN',
  setLang: () => {},
  t: (_, fallback) => fallback,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<AppLanguage>('EN');
  const t = (key: string, fallback: string) => dictionary[lang][key] || fallback;
  return <LanguageContext.Provider value={{ lang, setLang, t }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}
