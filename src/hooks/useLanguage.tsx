import { createContext, useContext, ReactNode } from 'react';

interface LanguageContextType {
  language: 'en';
  setLanguage: (lang: 'en') => void;
  t: (key: string) => string;
}

const translations: Record<string, string> = {
  'landing.hero.cta.abandoned': 'FIND ABANDONED FURNITURE',
  'landing.hero.cta.share': 'SHARE YOUR FINDS',
  'landing.stooping.title': 'STOOPING & THRIFTING APP',
  'landing.stooping.subtitle': 'save the planet by hunting abandoned furnitures. earn money exploring your city in a circular economy marketplace and game.',
  'landing.comingSoon': 'Coming soon',
  'landing.pokemon.text': 'Instead of hunting Pokémons, explore and hunt abandoned furnitures and other objects. Earn money and Save them from the landfill.',
  'landing.hunt.treasures': 'Hunt abandoned treasures and sell them $$$',
  'landing.hunt.explore': 'Explore your city and earn money by sharing photos and coordinates',
  'landing.coordinates.title': 'MAKE MONEY SHARING PHOTOS AND COORDINATES OF ABANDONED STREET FINDS',
  'landing.coordinates.feature1': 'hunt furniture, electronics or treasures abandoned on the street',
  'landing.coordinates.feature2': 'share the approximate location and earn money when someone buys the exact coordinates',
  'landing.coordinates.feature3': 'turn your daily walks into an urban business opportunity',
  'landing.coordinates.buy.title': 'BUY COORDINATES AND GET BARGAINS',
  'landing.coordinates.buy.description': 'you know there is a free couch 6 miles away from you but not exactly where, buy the coordinates and get a $200 couch for $1',
  'landing.thrift.title': 'EXPLORE LOCAL CIRCULAR THRIFT STORES AND GARAGE SALES',
  'landing.thrift.feature1': 'BROWSE CATALOGS OF LOCAL THRIFT STORES, GARAGE SALES AND CIRCULAR MARKETS FROM HOME. CHAT AND NEGOTIATE',
  'landing.thrift.feature2': "VISIT ONLY THE PLACES THAT HAVE WHAT YOU'RE LOOKING FOR, SAVING TIME AND GAS",
  'landing.thrift.feature3': 'ASK THEM TO COME TO YOUR HOUSE TO COLLECT YOUR UNWANTED ITEMS INSTEAD OF THROWING THEM IN THE TRASH',
  'landing.market.title': 'CREATE YOUR OWN CIRCULAR MARKET PROFILE FREE, MAKE MONEY WITH UNWANTED STUFF AND SAVE THE PLANET',
  'landing.economy.buy': '1 BUY',
  'landing.economy.use': '2 USE',
  'landing.economy.dump': '3 DUMP',
  'landing.economy.text': 'The linear economy of buy, use and Dump has changed forever',
  'landing.footer.tagline': 'Making local circular economy Easy, fun and profitable',
  'landing.beta.title': 'GET BETA AND PROJECT UPDATES',
  'landing.beta.description': 'Be among the first to try GreenHunt',
  'landing.beta.placeholder': 'Enter your email',
  'landing.beta.button': 'GET BETA',
  'landing.beta.joining': 'Sending...',
  'landing.beta.emailExists': 'This email is already on the waitlist!',
  'landing.beta.error': 'Something went wrong. Please try again.',
  'landing.beta.success': "We've sent you the beta by email!",
  'landing.beta.invalidEmail': 'Please enter a valid email address',
  'landing.markets.discover.title': 'DISCOVER LOCAL CIRCULAR MARKETS',
  'landing.markets.discover.feature1': 'Browse garage sales, thrift stores and circular markets near you',
  'landing.markets.discover.feature2': 'Find exact locations with our interactive map',
  'landing.markets.discover.feature3': 'Discover abandoned furniture left on the street',
  'landing.markets.discover.feature4': 'Create your own circular market or garage sale',
  'landing.survey.title': 'HELP US BUILD THE FUTURE',
  'landing.survey.description': 'Share your feedback and help us create the best stooping experience',
  'landing.survey.stooper.title': 'For Stooping Enthusiasts',
  'landing.survey.manager.title': 'For Circular Market Managers',
  'landing.survey.button': 'TAKE SURVEY',
  'landing.footer.privacy': 'Privacy Policy',
  'landing.footer.terms': 'Terms & Conditions',
  'landing.footer.cookies': 'Cookie Policy',
  'landing.footer.legal': 'Legal',
  'landing.footer.madeWith': 'Made to stop the linear economy apocalypse',
  'landing.footer.forPlanet': '',
  'landing.footer.contact': 'Contact: hello@greenhunt.net',
  'landing.ambassador.title': "Are you an Influencer?",
  'landing.ambassador.description': "If you are an influencer who shares our values and mission, let's discuss a partnership for the GreenHunt launch. Influencers who support us during this phase will become Lifetime Ambassadors, gaining access to exclusive perks like higher affiliate commissions and more",
  'landing.ambassador.button': 'Ambassadors program',
  'ambassador.dashboard': 'Ambassador Dashboard',
  'ambassador.welcome': 'Welcome',
  'ambassador.logout': 'Logout',
  'ambassador.login': 'Ambassador Login',
  'ambassador.nickname': 'Nickname',
  'ambassador.password': 'Password',
  'ambassador.loading': 'Loading...',
  'ambassador.loginBtn': 'Login',
  'ambassador.signupBtn': 'Sign Up',
  'ambassador.noAccount': "Don't have an account? Sign up",
  'ambassador.hasAccount': 'Already have an account? Login',
  'ambassador.backHome': 'Back to Home',
  'ambassador.gotStore': 'I Got a Store!',
  'ambassador.mySubmissions': 'My Store Submissions',
  'ambassador.leaderboard': 'Ambassador Leaderboard',
  'ambassador.form.title': 'Submit a New Store',
  'ambassador.form.storeName': 'Store Name',
  'ambassador.form.storeUrl': 'Website or Google Maps Profile',
  'ambassador.form.city': 'City',
  'ambassador.form.warning': 'Ask the store that signed the agreement to send us an email with the contract attached to hello@greenhunt.net. We will verify it and send commissions to the USD bank accounts configured in your profile at the end of the month.',
  'ambassador.form.submit': 'Submit Store',
  'ambassador.form.cancel': 'Cancel',
  'ambassador.form.success': 'Store submitted successfully!',
  'ambassador.form.error': 'Error submitting store',
  'ambassador.submissions.status': 'Status',
  'ambassador.submissions.pending': 'Pending Review',
  'ambassador.submissions.approved': 'Approved',
  'ambassador.submissions.rejected': 'Rejected',
  'ambassador.submissions.commission': 'Commission',
  'ambassador.submissions.submittedOn': 'Submitted on',
  'ambassador.submissions.empty': 'No submissions yet',
  'ambassador.leaderboard.rank': 'Rank',
  'ambassador.leaderboard.ambassador': 'Ambassador',
  'ambassador.leaderboard.stores': 'Stores',
  'ambassador.leaderboard.earned': 'Total Earned',
  'ambassador.leaderboard.empty': 'No ambassadors on the leaderboard yet',
  'ambassador.accountCreated': 'Ambassador account created successfully!',
  'ambassador.loginSuccess': 'Logged in successfully!',
  'ambassador.logoutSuccess': 'Logged out successfully',
  'ambassador.loginError': 'Error logging in',
  'ambassador.createError': 'Error creating account',
  'landing.tutorial.title': 'HOW IT WORKS',
  'landing.valueProp1.title': 'SNAP & SAVE',
  'landing.valueProp1.text': 'Save the planet by snapping photos of discarded street finds.',
  'landing.valueProp2.title': 'GRAB & RESCUE',
  'landing.valueProp2.text': 'Get free stuff in the streets and keep it out of the landfill.',
  'landing.valueProp3.title': 'TRACK & COMPETE',
  'landing.valueProp3.text': 'Track your impact earn rewards and compete with other local players.',
  'landing.thrifting.title': 'Local Phygital Thrifting',
  'landing.thrifting.step1': 'Explore catalogs of local thrift stores and garage sales. Chat and negotiate.',
  'landing.thrifting.step2': 'Ask them to come to your house to collect your unwanted items instead of throwing them in the trash.',
  'landing.thrifting.step3': 'Create your own circular market on your garage for free, make money with unwanted stuff.',
  'landing.waste.title': 'WASTE VALORIZATION',
  'landing.waste.step1': 'Share valuable item coordinates with your team with a push of a button.',
  'landing.waste.step2': 'Go to exact locations with an optimized route to pick up valuable stuff.',
  'landing.waste.step3': 'Donate it to local stores or sell it on your phygital circular market.',
  'landing.junk.title': 'SMART JUNK REMOVAL',
  'landing.junk.step1': 'Take photos of your junk and fill the form.',
  'landing.junk.step2': 'Other users bid to pay you or to charge you for removing the junk.',
  'landing.junk.step3': 'Accept the bid you want and schedule the pick up.',
  'landing.app.title': 'Stooping  real world game',
  'landing.app.subtitle': 'Your city is a board game where suddenly appears free valuable discarded stuff.\n\nShare photos and coordinates or go for it and save them from landfill.',
  'landing.playPlanet.title': 'Play for the planet',
  'landing.playPlanet.subtitle': 'For fun or for money, company or individual, play for the planet and measure the impact of the treasures you saved from the landfill',
  'landing.strategic.title': 'Seeking Strategic Partners',
  'landing.strategic.subtitle': 'We are seeking innovative companies in waste management, junk removal, or the resale and antique sectors. If our vision resonates with you and you\'re ready to innovate and co-create, let\'s explore a partnership.'
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const t = (key: string) => translations[key] || key;

  return (
    <LanguageContext.Provider value={{ language: 'en', setLanguage: () => {}, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
