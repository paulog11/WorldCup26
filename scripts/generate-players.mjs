import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const seedPath = resolve(__dirname, '..', 'data', 'seed.json')
const seed = JSON.parse(readFileSync(seedPath, 'utf-8'))

// Position distribution for a 26-man squad
const positionSlots = [
  'GK', 'GK', 'GK',
  'DF', 'DF', 'DF', 'DF', 'DF', 'DF', 'DF', 'DF',
  'MF', 'MF', 'MF', 'MF', 'MF', 'MF', 'MF', 'MF',
  'FW', 'FW', 'FW', 'FW', 'FW', 'FW', 'FW',
]

// Real-ish player names per team (first 26 for each)
const teamPlayers = {
  usa: {
    manager: 'Mauricio Pochettino',
    formation: '4-3-3',
    names: ['Matt Turner','Zack Steffen','Ethan Horvath','Sergino Dest','Chris Richards','Tim Ream','Mark McKenzie','Joe Scally','Antonee Robinson','DeJuan Jones','Cameron Carter-Vickers','Tyler Adams','Weston McKennie','Yunus Musah','Johnny Cardoso','Gianluca Busio','Malik Tillman','Luca de la Torre','Brenden Aaronson','Christian Pulisic','Timothy Weah','Folarin Balogun','Josh Sargent','Ricardo Pepi','Gio Reyna','Haji Wright'],
    clubs: ['Nottingham Forest','Colorado Rapids','Cardiff City','PSV','Crystal Palace','Fulham','Genk','Borussia Dortmund','Fulham','New England Revolution','Celtic','Bournemouth','Juventus','AC Milan','Real Betis','Inter Miami','PSV','Celta Vigo','Union Berlin','AC Milan','Juventus','Monaco','Brighton','PSV','Borussia Dortmund','Antalyaspor'],
  },
  mex: {
    manager: 'Javier Aguirre',
    formation: '4-3-3',
    names: ['Guillermo Ochoa','Luis Malagón','Carlos Acevedo','Jorge Sánchez','Johan Vásquez','César Montes','Jesús Gallardo','Kevin Álvarez','Gerardo Arteaga','Julián Araujo','Néstor Araujo','Edson Álvarez','Luis Romo','Carlos Rodríguez','Erick Gutiérrez','Sebastián Córdova','Diego Lainez','Orbelin Pineda','Roberto Alvarado','Hirving Lozano','Raúl Jiménez','Santiago Giménez','Alexis Vega','Henry Martín','Uriel Antuna','César Huerta'],
    clubs: ['Salernitana','Mallorca','Santos Laguna','Porto','Genoa','Monterrey','Galatasaray','Pachuca','Genk','Barcelona','Everton','West Ham','Cruz Azul','Cruz Azul','PSV','Tigres','Braga','AEK Athens','Guadalajara','San Diego FC','Fulham','Feyenoord','Toluca','América','Cruz Azul','Guadalajara'],
  },
  can: {
    manager: 'Jesse Marsch',
    formation: '4-4-2',
    names: ['Milan Borjan','Dayne St. Clair','James Pantemis','Alistair Johnston','Kamal Miller','Derek Cornelius','Richie Laryea','Samuel Adekugbe','Luca Koleosho','Moïse Bombito','Scott Kennedy','Stephen Eustáquio','Ismael Koné','Mark-Anthony Kaye','Samuel Piette','Mathieu Choinière','Ali Ahmed','Liam Millar','Tajon Buchanan','Alphonso Davies','Jonathan David','Cyle Larin','Jonathan Osorio','Jacen Russell-Rowe','Theo Corbeanu','Tani Oluwaseyi'],
    clubs: ['Red Star Belgrade','Minnesota United','CF Montréal','Celtic','CF Montréal','Malmö','Toronto FC','Valerenga','Burnley','Colorado Rapids','SSV Jahn Regensburg','Porto','Marseille','Toronto FC','CF Montréal','CF Montréal','Brampton FC','Basel','Inter Milan','Bayern Munich','Lille','Real Valladolid','Toronto FC','Columbus Crew','Blackpool','Minnesota United'],
  },
  col: {
    manager: 'Néstor Lorenzo',
    formation: '4-2-3-1',
    names: ['David Ospina','Camilo Vargas','Álvaro Montero','Daniel Muñoz','Davinson Sánchez','Yerry Mina','Johan Mojica','Santiago Arias','Carlos Cuesta','Jhon Lucumí','Cristian Borja','James Rodríguez','Wilmar Barrios','Mateus Uribe','Juan Fernando Quintero','Jefferson Lerma','Gustavo Cuéllar','Richard Ríos','Jorge Carrascal','Luis Díaz','Rafael Santos Borré','Jhon Córdoba','Luis Sinisterra','Miguel Borja','Jhon Arias','Juan Camilo Portilla'],
    clubs: ['Al Nassr','Atlas','Millonarios','Crystal Palace','Galatasaray','Cagliari','Mallorca','Bahia','Genk','Bologna','América de Cali','León','Zenit','Al Sadd','Racing Club','Crystal Palace','Al Shabab','Palmeiras','Dinamo Moscow','Liverpool','Internacional','Krasnodar','Bournemouth','River Plate','Fluminense','León'],
  },
  bra: {
    manager: 'Dorival Júnior',
    formation: '4-2-3-1',
    names: ['Alisson','Ederson','Bento','Danilo','Marquinhos','Éder Militão','Gabriel Magalhães','Guilherme Arana','Wendell','Yan Couto','Bremer','Casemiro','Bruno Guimarães','Lucas Paquetá','André','Gerson','João Gomes','Douglas Luiz','Andreas Pereira','Vinícius Júnior','Rodrygo','Raphinha','Endrick','Gabriel Martinelli','Savinho','Estêvão'],
    clubs: ['Liverpool','Manchester City','Al Nassr','Juventus','Paris Saint-Germain','Real Madrid','Arsenal','Atlético Mineiro','Porto','Borussia Dortmund','Juventus','Manchester United','Newcastle United','West Ham','Wolverhampton','Flamengo','Wolverhampton','Juventus','Fulham','Real Madrid','Real Madrid','Barcelona','Real Madrid','Arsenal','Manchester City','Palmeiras'],
  },
  arg: {
    manager: 'Lionel Scaloni',
    formation: '4-3-3',
    names: ['Emiliano Martínez','Gerónimo Rulli','Franco Armani','Nahuel Molina','Cristian Romero','Nicolás Otamendi','Lisandro Martínez','Nicolás Tagliafico','Marcos Acuña','Gonzalo Montiel','Germán Pezzella','Rodrigo De Paul','Enzo Fernández','Leandro Paredes','Giovani Lo Celso','Alexis Mac Allister','Exequiel Palacios','Ángel Correa','Thiago Almada','Lionel Messi','Lautaro Martínez','Julián Álvarez','Ángel Di María','Paulo Dybala','Nicolás González','Alejandro Garnacho'],
    clubs: ['Aston Villa','Marseille','River Plate','Atlético Madrid','Tottenham','Benfica','Manchester United','Lyon','Sevilla','Nottingham Forest','Real Betis','Atlético Madrid','Chelsea','Roma','Real Betis','Liverpool','Bayer Leverkusen','Atlético Madrid','Botafogo','Inter Miami','Inter Milan','Atlético Madrid','Benfica','Roma','Fiorentina','Manchester United'],
  },
  jpn: {
    manager: 'Hajime Moriyasu',
    formation: '4-2-3-1',
    names: ['Shuichi Gonda','Daniel Schmidt','Zion Suzuki','Hiroki Sakai','Takehiro Tomiyasu','Ko Itakura','Maya Yoshida','Yuto Nagatomo','Miki Yamane','Shogo Taniguchi','Hiroki Ito','Wataru Endo','Hidemasa Morita','Ao Tanaka','Daichi Kamada','Takefusa Kubo','Kaoru Mitoma','Ritsu Doan','Junya Ito','Takumi Minamino','Ayase Ueda','Kyogo Furuhashi','Daizen Maeda','Yuya Osako','Koji Miyoshi','Keito Nakamura'],
    clubs: ['Shimizu S-Pulse','Sint-Truiden','Parma','Urawa Reds','Arsenal','Borussia Mönchengladbach','Schalke 04','FC Tokyo','Celtic','Kawasaki Frontale','Bayern Munich','Liverpool','Sporting CP','Fortuna Düsseldorf','Crystal Palace','Real Sociedad','Brighton','Freiburg','Reims','Monaco','Feyenoord','Celtic','Celtic','Vissel Kobe','Royal Antwerp','Reims'],
  },
  ngr: {
    manager: 'Finidi George',
    formation: '4-3-3',
    names: ['Francis Uzoho','Maduka Okoye','Stanley Nwabali','Ola Aina','William Troost-Ekong','Calvin Bassey','Semi Ajayi','Zaidu Sanusi','Bright Osayi-Samuel','Tyronne Ebuehi','Olaoluwa Aina','Wilfred Ndidi','Alex Iwobi','Joe Aribo','Oghenekaro Etebo','Frank Onyeka','Raphael Onyedika','Fisayo Dele-Bashiru','Ademola Lookman','Victor Osimhen','Samuel Chukwueze','Kelechi Iheanacho','Paul Onuachu','Moses Simon','Chidera Ejuke','Victor Boniface'],
    clubs: ['Omonia','Udinese','Chippa United','Nottingham Forest','Al Kholood','Fulham','Sunderland','Porto','Fenerbahçe','Empoli','Nottingham Forest','Leicester City','Fulham','Southampton','Stoke City','Brentford','Club Brugge','Lazio','Atalanta','Galatasaray','AC Milan','Sevilla','Southampton','Nantes','CSKA Moscow','Bayer Leverkusen'],
  },
  fra: {
    manager: 'Didier Deschamps',
    formation: '4-3-3',
    names: ['Mike Maignan','Brice Samba','Alphonse Areola','Jules Koundé','Dayot Upamecano','William Saliba','Ibrahima Konaté','Theo Hernández','Ferland Mendy','Benjamin Pavard','Jonathan Clauss','N\'Golo Kanté','Aurélien Tchouaméni','Adrien Rabiot','Eduardo Camavinga','Warren Zaïre-Emery','Youssouf Fofana','Mattéo Guendouzi','Khéphren Thuram','Kylian Mbappé','Antoine Griezmann','Olivier Giroud','Ousmane Dembélé','Marcus Thuram','Randal Kolo Muani','Bradley Barcola'],
    clubs: ['AC Milan','Lens','West Ham','Barcelona','Bayern Munich','Arsenal','Liverpool','AC Milan','Real Madrid','Inter Milan','Marseille','Al Ittihad','Real Madrid','Juventus','Real Madrid','Paris Saint-Germain','AC Milan','Lazio','Juventus','Real Madrid','Atlético Madrid','AC Milan','Paris Saint-Germain','Inter Milan','Paris Saint-Germain','Paris Saint-Germain'],
  },
  eng: {
    manager: 'Thomas Tuchel',
    formation: '4-2-3-1',
    names: ['Jordan Pickford','Aaron Ramsdale','Dean Henderson','Kyle Walker','John Stones','Harry Maguire','Marc Guéhi','Luke Shaw','Ben Chilwell','Trent Alexander-Arnold','Ezri Konsa','Declan Rice','Jude Bellingham','Kobbie Mainoo','Conor Gallagher','Adam Wharton','Phil Foden','Bukayo Saka','Cole Palmer','Harry Kane','Ollie Watkins','Ivan Toney','Anthony Gordon','Jarrod Bowen','Eberechi Eze','Jack Grealish'],
    clubs: ['Everton','Arsenal','Crystal Palace','Manchester City','Manchester City','Manchester United','Crystal Palace','Manchester United','Chelsea','Liverpool','Aston Villa','Arsenal','Real Madrid','Manchester United','Atlético Madrid','Crystal Palace','Manchester City','Arsenal','Chelsea','Bayern Munich','Aston Villa','Al Ahli','Newcastle United','West Ham','Crystal Palace','Manchester City'],
  },
  sen: {
    manager: 'Aliou Cissé',
    formation: '4-3-3',
    names: ['Édouard Mendy','Seny Dieng','Alfred Gomis','Kalidou Koulibaly','Abdou Diallo','Youssouf Sabaly','Ismail Jakobs','Formose Mendy','Fode Ballo-Touré','Abdoulaye Seck','Moussa Niakhaté','Idrissa Gueye','Nampalys Mendy','Cheikhou Kouyaté','Pape Matar Sarr','Pathé Ciss','Pape Gueye','Lamine Camara','Habib Diarra','Sadio Mané','Ismaïla Sarr','Boulaye Dia','Nicolas Jackson','Iliman Ndiaye','Krépin Diatta','Bamba Dieng'],
    clubs: ['Al Ahli','QPR','Rennes','Al Hilal','Al Arabi','Real Betis','Galatasaray','Lorient','Fulham','Maccabi Haifa','Nottingham Forest','Everton','Leicester City','Nottingham Forest','Tottenham','Rayo Vallecano','Sevilla','Monaco','Strasbourg','Al Nassr','Crystal Palace','Lazio','Chelsea','Marseille','Monaco','Lorient'],
  },
  aus: {
    manager: 'Graham Arnold',
    formation: '4-2-3-1',
    names: ['Mat Ryan','Andrew Redmayne','Joe Gauci','Aziz Behich','Harry Souttar','Kye Rowles','Thomas Deng','Nathaniel Atkinson','Lewis Miller','Jason Geria','Gianni Stensness','Aaron Mooy','Jackson Irvine','Riley McGree','Connor Metcalfe','Aiden O\'Neill','Keanu Baccus','Cameron Devlin','Denis Genreau','Mathew Leckie','Jamie Maclaren','Mitchell Duke','Martin Boyle','Craig Goodwin','Awer Mabil','Garang Kuol'],
    clubs: ['AZ Alkmaar','Sydney FC','Adelaide United','Dundee United','Leicester City','Hearts','Albirex Niigata','Hearts','Hibernian','Melbourne Victory','Viking','Shanghai Port','St Pauli','Middlesbrough','St Gallen','Standard Liège','St Mirren','Hearts','Toulouse','Melbourne City','Melbourne City','Machida Zelvia','Hibernian','Adelaide United','Cadiz','Newcastle Jets'],
  },
  ger: {
    manager: 'Julian Nagelsmann',
    formation: '4-2-3-1',
    names: ['Manuel Neuer','Marc-André ter Stegen','Oliver Baumann','Joshua Kimmich','Antonio Rüdiger','Jonathan Tah','Nico Schlotterbeck','David Raum','Robin Gosens','Benjamin Henrichs','Robin Koch','Toni Kroos','İlkay Gündoğan','Robert Andrich','Pascal Groß','Chris Führich','Aleksandar Pavlović','Emre Can','Florian Wirtz','Jamal Musiala','Kai Havertz','Leroy Sané','Serge Gnabry','Thomas Müller','Niclas Füllkrug','Deniz Undav'],
    clubs: ['Bayern Munich','Barcelona','Hoffenheim','Bayern Munich','Real Madrid','Bayer Leverkusen','Borussia Dortmund','RB Leipzig','Union Berlin','RB Leipzig','Eintracht Frankfurt','Real Madrid','Barcelona','Bayer Leverkusen','Brighton','VfB Stuttgart','Bayern Munich','Borussia Dortmund','Bayer Leverkusen','Bayern Munich','Arsenal','Bayern Munich','Bayern Munich','Bayern Munich','West Ham','VfB Stuttgart'],
  },
  esp: {
    manager: 'Luis de la Fuente',
    formation: '4-3-3',
    names: ['Unai Simón','David Raya','Robert Sánchez','Dani Carvajal','Aymeric Laporte','Robin Le Normand','Pau Cubarsí','Marc Cucurella','Alejandro Grimaldo','César Azpilicueta','Nacho Fernández','Rodri','Pedri','Gavi','Fabián Ruiz','Martín Zubimendi','Mikel Merino','Fermín López','Dani Olmo','Lamine Yamal','Álvaro Morata','Nico Williams','Ferran Torres','Mikel Oyarzabal','Joselu','Ayoze Pérez'],
    clubs: ['Athletic Bilbao','Arsenal','Chelsea','Real Madrid','Al Nassr','Real Sociedad','Barcelona','Chelsea','Bayer Leverkusen','Atlético Madrid','Al Qadsiah','Manchester City','Barcelona','Barcelona','Paris Saint-Germain','Real Sociedad','Arsenal','Barcelona','Barcelona','Barcelona','AC Milan','Athletic Bilbao','Barcelona','Real Sociedad','Al Gharafa','Villarreal'],
  },
  uru: {
    manager: 'Marcelo Bielsa',
    formation: '4-3-3',
    names: ['Fernando Muslera','Sergio Rochet','Santiago Mele','Nahitan Nández','José María Giménez','Ronald Araújo','Sebastián Coates','Mathías Olivera','Matías Viña','Guillermo Varela','Sebastián Cáceres','Federico Valverde','Rodrigo Bentancur','Manuel Ugarte','Giorgian De Arrascaeta','Nicolás De La Cruz','Facundo Pellistri','Agustín Canobbio','Facundo Torres','Luis Suárez','Darwin Núñez','Maximiliano Gómez','Cristhian Stuani','Jonathan Rodríguez','Miguel Merentiel','Thiago Borbas'],
    clubs: ['Galatasaray','Internacional','Lanús','Al Ain','Atlético Madrid','Barcelona','Sporting CP','Napoli','Flamengo','Flamengo','América','Real Madrid','Tottenham','Paris Saint-Germain','Flamengo','Flamengo','Manchester United','Athletico Paranaense','Orlando City','Inter Miami','Liverpool','Trabzonspor','Girona','América','Boca Juniors','Peñarol'],
  },
  kor: {
    manager: 'Hong Myung-bo',
    formation: '4-2-3-1',
    names: ['Kim Seung-gyu','Jo Hyeon-woo','Song Bum-keun','Kim Min-jae','Kim Young-gwon','Kwon Kyung-won','Cho Yu-min','Kim Jin-su','Kim Moon-hwan','Park Ji-su','Seol Young-woo','Son Heung-min','Lee Jae-sung','Jung Woo-young','Kwon Chang-hoon','Hwang In-beom','Lee Kang-in','Paik Seung-ho','Na Sang-ho','Hwang Hee-chan','Cho Gue-sung','Joo Min-kyu','Song Min-kyu','Lee Dong-gyeong','Oh Hyeon-gyu','Jeong Sang-bin'],
    clubs: ['Al Shabab','Ulsan Hyundai','Jeonbuk Hyundai','Bayern Munich','Ulsan Hyundai','Gamba Osaka','Daejeon Citizen','Jeonbuk Hyundai','Jeonbuk Hyundai','Gwangju FC','Ulsan Hyundai','Tottenham','Mainz 05','Al Sadd','Gimcheon Sangmu','Red Star Belgrade','Paris Saint-Germain','Jeonbuk Hyundai','FC Seoul','Wolverhampton','Midtjylland','Jeonbuk Hyundai','Jeonbuk Hyundai','Ulsan Hyundai','Celtic','Grasshopper'],
  },
  por: {
    manager: 'Roberto Martínez',
    formation: '4-3-3',
    names: ['Diogo Costa','Rui Patrício','José Sá','João Cancelo','Pepe','Rúben Dias','Nuno Mendes','Diogo Dalot','Nelson Semedo','Gonçalo Inácio','António Silva','Bruno Fernandes','Bernardo Silva','Vitinha','João Palhinha','Rúben Neves','João Mário','Otávio','Matheus Nunes','Cristiano Ronaldo','Rafael Leão','Gonçalo Ramos','João Félix','Diogo Jota','Pedro Neto','Francisco Conceição'],
    clubs: ['Porto','Roma','Wolverhampton','Barcelona','Porto','Manchester City','Paris Saint-Germain','Manchester United','Wolverhampton','Sporting CP','Benfica','Manchester United','Manchester City','Paris Saint-Germain','Bayern Munich','Al Hilal','Benfica','Al Nassr','Manchester City','Al Nassr','AC Milan','Paris Saint-Germain','Chelsea','Liverpool','Chelsea','Juventus'],
  },
  ned: {
    manager: 'Ronald Koeman',
    formation: '3-4-1-2',
    names: ['Bart Verbruggen','Mark Flekken','Justin Bijlow','Virgil van Dijk','Nathan Aké','Stefan de Vrij','Micky van de Ven','Denzel Dumfries','Lutsharel Geertruida','Daley Blind','Jurriën Timber','Frenkie de Jong','Ryan Gravenberch','Tijjani Reijnders','Teun Koopmeiners','Jerdy Schouten','Joey Veerman','Marten de Roon','Xavi Simons','Memphis Depay','Cody Gakpo','Donyell Malen','Steven Bergwijn','Wout Weghorst','Brian Brobbey','Joshua Zirkzee'],
    clubs: ['Brighton','Brentford','Feyenoord','Liverpool','Manchester City','Inter Milan','Tottenham','Inter Milan','Feyenoord','Girona','Arsenal','Barcelona','Liverpool','AC Milan','Juventus','PSV','PSV','Atalanta','RB Leipzig','Atlético Madrid','Liverpool','Borussia Dortmund','Al Ittihad','Burnley','Ajax','Manchester United'],
  },
  crc: {
    manager: 'Gustavo Alfaro',
    formation: '5-4-1',
    names: ['Keylor Navas','Patrick Sequeira','Esteban Alvarado','Francisco Calvo','Óscar Duarte','Juan Pablo Vargas','Bryan Oviedo','Keysher Fuller','Haxzel Quirós','Gerald Taylor','Jeyland Mitchell','Celso Borges','Bryan Ruiz','Yeltsin Tejeda','Gerson Torres','Jewison Bennette','Brandon Aguilera','Josimar Alcócer','Álvaro Zamora','Joel Campbell','Anthony Contreras','Manfred Ugalde','Johan Venegas','Alonso Martínez','Warren Madrigal','Andy Rojas'],
    clubs: ['Retired','Ibiza','Herediano','San José Earthquakes','Levante','Millonarios','Retired','Herediano','Herediano','Saprissa','Alajuelense','Alajuelense','Retired','Saprissa','Herediano','Sunderland','Nottingham Forest','Santos de Guápiles','Saprissa','Alajuelense','Herediano','Twente','Saprissa','New York City FC','Saprissa','Saprissa'],
  },
  gha: {
    manager: 'Otto Addo',
    formation: '4-2-3-1',
    names: ['Richard Ofori','Lawrence Ati-Zigi','Abdul Manaf Nurudeen','Tariq Lamptey','Mohammed Salisu','Daniel Amartey','Alexander Djiku','Gideon Mensah','Alidu Seidu','Dennis Odoi','Joseph Aidoo','Thomas Partey','Mohammed Kudus','Salis Abdul Samed','Elisha Owusu','Ibrahim Sulemana','Daniel Kofi Kyereh','Edmund Addo','Fatawu Issahaku','André Ayew','Jordan Ayew','Inaki Williams','Antoine Semenyo','Osman Bukari','Kamaldeen Sulemana','Abdul Fatawu Issahaku'],
    clubs: ['Orlando Pirates','St Gallen','KAS Eupen','Brighton','Monaco','Randers','Strasbourg','Auxerre','Clermont Foot','Club Brugge','Celta Vigo','Arsenal','West Ham','Lens','Angers','Cagliari','Freiburg','Sheriff Tiraspol','Leicester City','Le Havre','Crystal Palace','Athletic Bilbao','Bournemouth','Red Star Belgrade','Southampton','Leicester City'],
  },
  ita: {
    manager: 'Luciano Spalletti',
    formation: '3-5-2',
    names: ['Gianluigi Donnarumma','Alex Meret','Guglielmo Vicario','Giovanni Di Lorenzo','Alessandro Bastoni','Riccardo Calafiori','Gianluca Mancini','Federico Dimarco','Andrea Cambiaso','Matteo Darmian','Giorgio Scalvini','Niccolò Barella','Jorginho','Sandro Tonali','Lorenzo Pellegrini','Davide Frattesi','Samuele Ricci','Bryan Cristante','Nicolò Fagioli','Federico Chiesa','Gianluca Scamacca','Giacomo Raspadori','Mateo Retegui','Stephan El Shaarawy','Mattia Zaccagni','Lorenzo Lucca'],
    clubs: ['Paris Saint-Germain','Napoli','Tottenham','Napoli','Inter Milan','Arsenal','Roma','Inter Milan','Juventus','Inter Milan','Atalanta','Inter Milan','Arsenal','Newcastle United','Roma','Inter Milan','Torino','Roma','Juventus','Liverpool','Atalanta','Napoli','Atalanta','Roma','Lazio','Udinese'],
  },
  cro: {
    manager: 'Zlatko Dalić',
    formation: '4-3-3',
    names: ['Dominik Livaković','Ivica Ivušić','Nediljko Labrović','Josip Stanišić','Joško Gvardiol','Duje Ćaleta-Car','Borna Sosa','Josip Juranović','Domagoj Vida','Josip Šutalo','Marin Pongračić','Luka Modrić','Mateo Kovačić','Marcelo Brozović','Mario Pašalić','Nikola Vlašić','Lovro Majer','Luka Sučić','Martin Baturina','Ivan Perišić','Bruno Petković','Andrej Kramarić','Ante Budimir','Marko Livaja','Luka Ivanušec','Igor Matanović'],
    clubs: ['Fenerbahçe','Osijek','Rijeka','Bayer Leverkusen','Manchester City','Lyon','Ajax','Union Berlin','AEK Athens','Ajax','Rennes','Real Madrid','Manchester City','Al Nassr','Atalanta','Torino','Wolfsburg','Real Sociedad','Dinamo Zagreb','Hajduk Split','Dinamo Zagreb','Hoffenheim','Osasuna','Hajduk Split','Feyenoord','Eintracht Frankfurt'],
  },
  mar: {
    manager: 'Walid Regragui',
    formation: '4-3-3',
    names: ['Yassine Bounou','Munir El Kajoui','Anas Zniti','Achraf Hakimi','Noussair Mazraoui','Nayef Aguerd','Romain Saïss','Adam Masina','Achraf Dari','Jawad El Yamiq','Samy Mmaee','Sofyan Amrabat','Azzedine Ounahi','Selim Amallah','Bilal El Khannouss','Abdelhamid Sabiri','Yahia Attiyat Allah','Ilias Chair','Amine Harit','Hakim Ziyech','Youssef En-Nesyri','Sofiane Boufal','Abdelhamid Sabiri','Abde Ezzalzouli','Brahim Díaz','Ayoub El Kaabi'],
    clubs: ['Al Hilal','Hatayspor','Wydad Casablanca','Paris Saint-Germain','Manchester United','West Ham','Al Shabab','Fiorentina','Brest','Real Valladolid','Ferencváros','Fenerbahçe','Marseille','Valladolid','Leicester City','Fiorentina','Wydad Casablanca','QPR','Marseille','Galatasaray','Sevilla','Angers','Fiorentina','Real Betis','Real Madrid','Olympiacos'],
  },
  ecu: {
    manager: 'Félix Sánchez',
    formation: '4-3-3',
    names: ['Hernán Galíndez','Alexander Domínguez','Moisés Ramírez','Angelo Preciado','Pervis Estupiñán','Piero Hincapié','Xavier Arreaga','Félix Torres','Diego Palacios','Robert Arboleda','Jackson Porozo','Moisés Caicedo','Carlos Gruezo','Alan Franco','Jhegson Méndez','Jeremy Sarmiento','Gonzalo Plata','Angelo Preciado','Kendry Páez','Enner Valencia','Michael Estrada','Kevin Rodríguez','Jordy Caicedo','Leonardo Campana','John Yeboah','Jeremy Sarmiento'],
    clubs: ['Aucas','Liga de Quito','Independiente del Valle','Genk','Brighton','Bayer Leverkusen','Seattle Sounders','Santos Laguna','Los Angeles FC','São Paulo','Troyes','Chelsea','Augsburg','Talleres','Los Angeles FC','Brighton','Al Sadd','Genk','Independiente del Valle','Internacional','Cruz Azul','LDU Quito','CSKA Sofia','Wolverhampton','Augsburg','Brighton'],
  },
  bel: {
    manager: 'Domenico Tedesco',
    formation: '4-3-3',
    names: ['Thibaut Courtois','Koen Casteels','Matz Sels','Timothy Castagne','Jan Vertonghen','Wout Faes','Arthur Theate','Axel Witsel','Thomas Meunier','Zeno Debast','Maxim De Cuyper','Kevin De Bruyne','Youri Tielemans','Amadou Onana','Orel Mangala','Aster Vranckx','Arthur Vermeeren','Charles De Ketelaere','Johan Bakayoko','Romelu Lukaku','Jérémy Doku','Loïs Openda','Leandro Trossard','Dodi Lukebakio','Yannick Carrasco','Lois Openda'],
    clubs: ['Real Madrid','Wolfsburg','Nottingham Forest','Fulham','Anderlecht','Leicester City','Rennes','Atlético Madrid','Trabzonspor','Sporting CP','Club Brugge','Manchester City','Aston Villa','Everton','Lyon','Wolfsburg','Atlético Madrid','Atalanta','PSV','Napoli','Manchester City','RB Leipzig','Arsenal','Sevilla','Al Shabab','RB Leipzig'],
  },
  den: {
    manager: 'Kasper Hjulmand',
    formation: '3-4-3',
    names: ['Kasper Schmeichel','Frederik Rønnow','Mads Hermansen','Simon Kjær','Andreas Christensen','Jannik Vestergaard','Joachim Andersen','Victor Kristiansen','Alexander Bah','Joakim Mæhle','Rasmus Kristensen','Christian Eriksen','Pierre-Emile Højbjerg','Thomas Delaney','Morten Hjulmand','Matt O\'Riley','Christian Nørgaard','Mikkel Damsgaard','Jesper Lindstrøm','Rasmus Højlund','Jonas Wind','Yussuf Poulsen','Kasper Dolberg','Andreas Skov Olsen','Martin Braithwaite','Andreas Cornelius'],
    clubs: ['Celtic','Union Berlin','Leicester City','AC Milan','Barcelona','Leicester City','Crystal Palace','Bologna','Benfica','Wolfsburg','Eintracht Frankfurt','Manchester United','Marseille','Anderlecht','Sporting CP','Brighton','Brentford','Brentford','Everton','Manchester United','Wolfsburg','RB Leipzig','Anderlecht','Club Brugge','Espanyol','Copenhagen'],
  },
  chi: {
    manager: 'Ricardo Gareca',
    formation: '4-3-3',
    names: ['Claudio Bravo','Gabriel Arias','Brayan Cortés','Mauricio Isla','Gary Medel','Guillermo Maripán','Paulo Díaz','Gabriel Suazo','Thomas Galdames','Benjamín Kuscevic','Igor Lichnovsky','Arturo Vidal','Charles Aránguiz','Erick Pulgar','Marcelino Núñez','Diego Valdés','Darío Osorio','Rodrigo Echeverría','Luciano Cabral','Alexis Sánchez','Eduardo Vargas','Ben Brereton Díaz','Víctor Dávila','Carlos Palacios','Damián Pizarro','Alexander Aravena'],
    clubs: ['Real Betis','Racing Club','Colo-Colo','Flamengo','Vasco da Gama','Monaco','River Plate','Toulouse','Genoa','Palmeiras','América','Colo-Colo','Internacional','Flamengo','Norwich City','América','Midtjylland','Huracán','Talleres','Inter Milan','Atlético Mineiro','Villarreal','CSKA Moscow','Colo-Colo','Udinese','Universidad Católica'],
  },
  cmr: {
    manager: 'Rigobert Song',
    formation: '4-3-3',
    names: ['André Onana','Devis Epassy','Simon Ngapandouetnbu','Collins Fai','Jean-Charles Castelletto','Nicolas N\'Koulou','Christopher Wooh','Nouhou Tolo','Ambroise Oyongo','Olivier Mbaizo','Enzo Ebosse','André-Frank Zambo Anguissa','Martin Hongla','Samuel Gouet','Gaël Ondoua','Pierre Kunde','Olivier Ntcham','Georges-Kévin N\'Koudou','James Léa Siliki','Vincent Aboubakar','Eric Maxim Choupo-Moting','Karl Toko Ekambi','Bryan Mbeumo','Christian Bassogog','Nicolas Moumi Ngamaleu','Frank Anguissa'],
    clubs: ['Manchester United','Abha','Montpellier','Al Tai','Nantes','Retired','Rennes','Seattle Sounders','Montpellier','Philadelphia Union','Udinese','Napoli','Verona','Mechelen','Toulouse','Mainz 05','Swansea City','Adana Demirspor','Rennes','Beşiktaş','Bayern Munich','Lyon','Brentford','Shanghai Port','Young Boys','Napoli'],
  },
  sui: {
    manager: 'Murat Yakin',
    formation: '3-4-2-1',
    names: ['Yann Sommer','Gregor Kobel','Jonas Omlin','Manuel Akanji','Fabian Schär','Nico Elvedi','Ricardo Rodríguez','Silvan Widmer','Ulisses Garcia','Leonidas Stergiou','Eray Cömert','Granit Xhaka','Denis Zakaria','Remo Freuler','Michel Aebischer','Djibril Sow','Ardon Jashari','Fabian Rieder','Vincent Sierro','Xherdan Shaqiri','Breel Embolo','Noah Okafor','Ruben Vargas','Zeki Amdouni','Dan Ndoye','Renato Steffen'],
    clubs: ['Inter Milan','Borussia Dortmund','Montpellier','Manchester City','Newcastle United','Borussia Mönchengladbach','Real Betis','Mainz 05','Marseille','Young Boys','Valencia','Bayer Leverkusen','Monaco','Nottingham Forest','Bologna','Eintracht Frankfurt','Brugge','Rennes','Sion','Chicago Fire','Monaco','AC Milan','Augsburg','Burnley','Bologna','Lugano'],
  },
  srb: {
    manager: 'Dragan Stojković',
    formation: '3-4-1-2',
    names: ['Predrag Rajković','Vanja Milinković-Savić','Đorđe Petrović','Nikola Milenković','Strahinja Pavlović','Miloš Veljković','Srđan Babić','Filip Mladenović','Strahinja Eraković','Nemanja Stojić','Erhan Mašović','Dušan Tadić','Sergej Milinković-Savić','Filip Kostić','Nemanja Gudelj','Saša Lukić','Ivan Ilić','Nemanja Maksimović','Andrija Živković','Aleksandar Mitrović','Dušan Vlahović','Luka Jović','Filip Đuričić','Željko Gavrić','Petar Ratkov','Samed Bazdar'],
    clubs: ['Mallorca','Torino','Chelsea','Fiorentina','Salzburg','Werder Bremen','Almería','Legia Warsaw','Red Star Belgrade','Red Star Belgrade','Bochum','Fenerbahçe','Al Hilal','Juventus','Sevilla','Fulham','Torino','Getafe','PAOK','Al Hilal','Juventus','AC Milan','APOEL','Red Star Belgrade','Salzburg','Partizan'],
  },
  par: {
    manager: 'Daniel Garnero',
    formation: '4-4-2',
    names: ['Antony Silva','Alfaro Aguilar','Carlos Coronel','Gustavo Gómez','Omar Alderete','Fabián Balbuena','Junior Alonso','Robert Rojas','Alberto Espínola','Santiago Arzamendia','Iván Ramírez','Miguel Almirón','Ángel Romero','Mathías Villasanti','Richard Sánchez','Andrés Cubas','Óscar Romero','Hernesto Caballero','Matías Rojas','Julio Enciso','Adam Bareiro','Ramón Sosa','Gabriel Ávalos','Alex Arce','Derlis González','Antonio Sanabria'],
    clubs: ['Cerro Porteño','Cerro Porteño','New York Red Bulls','Palmeiras','Getafe','Corinthians','Krasnodar','River Plate','Cerro Porteño','Girona','Olimpia','Atlanta United','Corinthians','Grêmio','América','Nantes','Racing Club','Cerro Porteño','Inter Miami','Brighton','São Paulo','Talleres','Lanús','Liga de Quito','Olimpia','Torino'],
  },
  irn: {
    manager: 'Amir Ghalenoei',
    formation: '4-1-4-1',
    names: ['Alireza Beiranvand','Hossein Hosseini','Amir Abedzadeh','Sadegh Moharrami','Shojae Khalilzadeh','Morteza Pouraliganji','Ehsan Hajsafi','Milad Mohammadi','Ramin Rezaeian','Majid Hosseini','Hossein Kanaani','Saeid Ezatolahi','Ahmad Nourollahi','Ali Karimi','Alireza Jahanbakhsh','Saman Ghoddos','Omid Ebrahimi','Vahid Amiri','Ali Gholizadeh','Mehdi Taremi','Sardar Azmoun','Karim Ansarifard','Shahab Zahedi','Allahyar Sayyadmanesh','Shahriyar Moghanlou','Reza Asadi'],
    clubs: ['Persepolis','Esteghlal','Ponferradina','Dinamo Zagreb','Al Ahli','Persepolis','AEK Athens','AEK Athens','Sepahan','Kayserispor','Persepolis','Vejle','Shabab Al Ahli','Kayserispor','Feyenoord','Brentford','Al Sailiya','Persepolis','Charleroi','Inter Milan','Roma','Omonia','Zorya','Hull City','Sepahan','Persepolis'],
  },
  pol: {
    manager: 'Michał Probierz',
    formation: '3-5-2',
    names: ['Wojciech Szczęsny','Łukasz Skorupski','Marcin Bułka','Jan Bednarek','Jakub Kiwior','Kamil Glik','Bartosz Salamon','Przemysław Frankowski','Nicola Zalewski','Paweł Dawidowicz','Bartosz Bereszyński','Piotr Zieliński','Sebastian Szymański','Jakub Moder','Damian Szymański','Jacek Góralski','Maik Nawrocki','Kacper Urbański','Jakub Kamiński','Robert Lewandowski','Arkadiusz Milik','Krzysztof Piątek','Karol Świderski','Adam Buksa','Kamil Grosicki','Michał Skóraś'],
    clubs: ['Barcelona','Bologna','Nice','Southampton','Arsenal','Benevento','Lech Poznań','Lens','Roma','Verona','Sampdoria','Inter Milan','Fenerbahçe','Brighton','AEK Athens','Omonia','Werder Bremen','Bologna','Wolfsburg','Barcelona','Juventus','İstanbul Başakşehir','Charlotte FC','Antalyaspor','Pogoń Szczecin','Club Brugge'],
  },
  swe: {
    manager: 'Jon Dahl Tomasson',
    formation: '4-4-2',
    names: ['Robin Olsen','Karl-Johan Johnsson','Peter Walta','Emil Krafth','Victor Lindelöf','Hjalmar Ekdal','Carl Starfelt','Ludwig Augustinsson','Gabriel Gudmundsson','Jens Cajuste','Edvin Kurtulus','Emil Forsberg','Albin Ekdal','Sebastian Larsson','Dejan Kulusevski','Jens Cajuste','Mattias Svanberg','Hugo Larsson','Viktor Gyökeres','Alexander Isak','Anthony Elanga','Robin Quaison','Joel Asoro','Jordan Larsson','Jesper Karlström','Ken Sema'],
    clubs: ['Aston Villa','Strasbourg','Halmstads BK','Newcastle United','Manchester United','Burnley','Celta Vigo','Aston Villa','Fiorentina','Napoli','Sassuolo','New York Red Bulls','Spezia','AIK','Tottenham','Napoli','Wolfsburg','Eintracht Frankfurt','Sporting CP','Newcastle United','Nottingham Forest','Al Ettifaq','Djurgårdens','AIK','Lech Poznań','Watford'],
  },
  alg: {
    manager: 'Vladimir Petković',
    formation: '4-3-3',
    names: ['Raïs M\'Bolhi','Moustapha Zeghba','Alexandre Oukidja','Aïssa Mandi','Djamel Benlamri','Ramy Bensebaini','Youcef Atal','Hocine Benayada','Mehdi Zeffane','Abdelkader Bedrane','Jaouen Hadjam','Ismaël Bennacer','Sofiane Feghouli','Nabil Bentaleb','Ramiz Zerrouki','Hichem Boudaoui','Houssem Aouar','Amine Gouiri','Yacine Adli','Riyad Mahrez','Islam Slimani','Youcef Belaïli','Saïd Benrahma','Baghdad Bounedjah','Mohamed Amoura','Andy Delort'],
    clubs: ['Al Shabab','Constantine','Metz','Villarreal','Al Ahli Saudi','Borussia Dortmund','Nice','ES Tunis','Al Fateh','Constantine','Brest','AC Milan','Galatasaray','Lille','Feyenoord','Nice','Lyon','Rennes','AC Milan','Al Ahli','Coritiba','Stade Tunisien','West Ham','Al Sadd','Young Boys','Nice'],
  },
  nzl: {
    manager: 'Darren Bazeley',
    formation: '4-4-2',
    names: ['Stefan Marinovic','Oliver Sail','Alex Paulsen','Winston Reid','Tommy Smith','Nando Pijnaker','Michael Boxall','Liberato Cacace','Storm Roux','Kelvin Kalua','Tim Payne','Joe Bell','Marko Stamenic','Sarpreet Singh','Cameron Devlin','Bill Tuiloma','Matthew Garbett','Elijah Just','Alex Greive','Chris Wood','Ben Waine','Kosta Barbarouses','Logan Rogerson','Jesse Randall','Oskar van Hattum','Ben Old'],
    clubs: ['St Louis City','AC Horsens','Wellington Phoenix','Portland Timbers','Colchester United','Sparta Rotterdam','Minnesota United','Empoli','Central Coast Mariners','Wellington Phoenix','Wellington Phoenix','Viking','Red Star Belgrade','Regensburg','Hearts','Portland Timbers','NAC Breda','Wellington Phoenix','Daejeon Hana Citizen','Nottingham Forest','Plymouth Argyle','Wellington Phoenix','Breda','Wellington Phoenix','Wellington Phoenix','Wellington Phoenix'],
  },
  aut: {
    manager: 'Ralf Rangnick',
    formation: '4-2-3-1',
    names: ['Patrick Pentz','Heinz Lindner','Niklas Hedl','Philipp Lienhart','David Alaba','Kevin Danso','Maximilian Wöber','Philipp Mwene','Stefan Posch','Flavius Daniliuc','Gernot Trauner','Marcel Sabitzer','Konrad Laimer','Florian Grillitsch','Nicolas Seiwald','Alexander Prass','Romano Schmid','Patrick Wimmer','Christoph Baumgartner','Marko Arnautović','Michael Gregoritsch','Andreas Weimann','Maximilian Entrup','Ercan Kara','Junior Adamu','Marco Grüll'],
    clubs: ['Brøndby','Union Saint-Gilloise','Rapid Wien','Freiburg','Real Madrid','Lens','Leeds United','Mainz 05','Bologna','Salzburg','Feyenoord','Borussia Dortmund','Bayern Munich','Hoffenheim','RB Leipzig','Sturm Graz','Werder Bremen','Wolfsburg','RB Leipzig','Inter Milan','Freiburg','Bristol City','Hartberg','Orlando City','Salzburg','Rapid Wien'],
  },
  tur: {
    manager: 'Vincenzo Montella',
    formation: '4-2-3-1',
    names: ['Altay Bayındır','Uğurcan Çakır','Mert Günok','Zeki Çelik','Merih Demiral','Samet Akaydin','Abdülkerim Bardakcı','Ferdi Kadıoğlu','Mert Müldür','Kaan Ayhan','Ozan Kabak','Hakan Çalhanoğlu','İrfan Can Kahveci','Okay Yokuşlu','Orkun Kökçü','Salih Özcan','Arda Güler','İsmail Yüksek','Yusuf Yazıcı','Barış Alper Yılmaz','Kerem Aktürkoğlu','Cenk Tosun','Enes Ünal','Semih Kılıçsoy','Kenan Yıldız','Yunus Akgün'],
    clubs: ['Manchester United','Trabzonspor','Beşiktaş','Roma','Al Ahli','Fenerbahçe','Galatasaray','Brighton','Fenerbahçe','Galatasaray','Hoffenheim','Inter Milan','Fenerbahçe','West Bromwich Albion','Benfica','Borussia Dortmund','Real Madrid','Fenerbahçe','Lille','Galatasaray','Galatasaray','Beşiktaş','Bournemouth','Beşiktaş','Juventus','Leicester City'],
  },
  per: {
    manager: 'Jorge Fossati',
    formation: '4-2-3-1',
    names: ['Pedro Gallese','Carlos Cáceda','Diego Romero','Luis Advíncula','Alexander Callens','Carlos Zambrano','Miguel Araujo','Marcos López','Aldo Corzo','Luis Abram','Anderson Santamaría','Renato Tapia','Yoshimar Yotún','Pedro Aquino','Sergio Peña','Wilder Cartagena','Piero Quispe','Christofer Gonzáles','Raziel García','André Carrillo','Edison Flores','Gianluca Lapadula','Paolo Guerrero','Bryan Reyna','Alex Valera','Joao Grimaldo'],
    clubs: ['Orlando City','Melgar','Universitario','Boca Juniors','AEK Athens','Alianza Lima','FC Emmen','Feyenoord','Universitario','Atlanta United','Santos','Celta Vigo','Sporting Cristal','Cruz Azul','Malmö','Orlando City','Pumas UNAM','Sporting Cristal','Cienciano','Al Qadisiyah','Atlas','Cagliari','César Vallejo','Belgrano','Universitario','Sporting Cristal'],
  },
  civ: {
    manager: 'Emerse Faé',
    formation: '4-3-3',
    names: ['Badra Ali Sangaré','Yahia Fofana','Eliezer Ira Tape','Serge Aurier','Eric Bailly','Willy Boly','Simon Deli','Ghislain Konan','Odilon Kossounou','Emmanuel Agbadou','Evan N\'Dicka','Franck Kessié','Seko Fofana','Ibrahim Sangaré','Jean Michaël Seri','Hamed Traoré','Max-Alain Gradel','Sébastien Haller','Wilfried Kanon','Nicolas Pépé','Wilfried Zaha','Jérémie Boga','Simon Adingra','Christian Kouamé','Oumar Diakité','Karim Konaté'],
    clubs: ['Retired','Angers','San Pedro','Galatasaray','Villarreal','Nottingham Forest','Istanbul Başakşehir','Al Hazm','Bayer Leverkusen','Reims','Roma','Al Ahli','Al Nassr','PSV','Fulham','Napoli','Sivasspor','Borussia Dortmund','Al Batin','Nice','Lyon','Nice','Brighton','Fiorentina','Reims','Salzburg'],
  },
  sco: {
    manager: 'Steve Clarke',
    formation: '5-4-1',
    names: ['Angus Gunn','Zander Clark','Liam Kelly','Andrew Robertson','Kieran Tierney','Jack Hendry','Grant Hanley','Ryan Porteous','Scott McKenna','Anthony Ralston','Greg Taylor','Scott McTominay','Callum McGregor','Billy Gilmour','John McGinn','Ryan Christie','Stuart Armstrong','Kenny McLean','Lewis Ferguson','Che Adams','Lyndon Dykes','Lawrence Shankland','Ryan Fraser','James Forrest','Ben Doak','Tommy Conway'],
    clubs: ['Norwich City','Hearts','Motherwell','Liverpool','Real Sociedad','Al Ettifaq','Norwich City','Watford','Copenhagen','Celtic','Celtic','Napoli','Celtic','Brighton','Aston Villa','Bournemouth','Southampton','Norwich City','Bologna','Torino','QPR','Hearts','Newcastle United','Celtic','Liverpool','Middlesbrough'],
  },
  ukr: {
    manager: 'Serhii Rebrov',
    formation: '4-3-3',
    names: ['Anatoliy Trubin','Heorhii Bushchan','Andriy Lunin','Oleksandr Tymchyk','Illia Zabarnyi','Mykola Matviienko','Vitaliy Mykolenko','Yukhym Konoplia','Oleksandr Svatok','Valeriy Bondar','Bogdan Mykhailichenko','Oleksandr Zinchenko','Taras Stepanenko','Serhiy Sydorchuk','Mykola Shaparenko','Ruslan Malinovskyi','Viktor Tsygankov','Georgiy Sudakov','Volodymyr Brazhko','Andriy Yarmolenko','Artem Dovbyk','Mykhailo Mudryk','Roman Yaremchuk','Oleksandr Zubkov','Danylo Sikan','Vladyslav Vanat'],
    clubs: ['Benfica','Dynamo Kyiv','Real Madrid','Shakhtar Donetsk','Bournemouth','Shakhtar Donetsk','Everton','Shakhtar Donetsk','Shakhtar Donetsk','Shakhtar Donetsk','Dynamo Kyiv','Arsenal','Shakhtar Donetsk','Dynamo Kyiv','Dynamo Kyiv','Genoa','Girona','Shakhtar Donetsk','Dynamo Kyiv','Al Ain','Roma','Chelsea','Valencia','Shakhtar Donetsk','Feyenoord','Dynamo Kyiv'],
  },
  jam: {
    manager: 'Heimir Hallgrímsson',
    formation: '4-4-2',
    names: ['Andre Blake','Dillon Barnes','Jahmali Waite','Kemar Lawrence','Liam Moore','Damion Lowe','Amari\'i Bell','Greg Leigh','Adrian Mariappa','Di\'Shon Bernard','Ethan Pinnock','Leon Bailey','Michail Antonio','Ravel Morrison','Bobby Decordova-Reid','Daniel Johnson','Devon Williams','Tyreek Magee','Joel Latibeaudiere','Shamar Nicholson','Demarai Gray','Romario Williams','Dujuan Richards','Kasey Palmer','Andre Gray','Javain Brown'],
    clubs: ['Philadelphia Union','Barrow','Philadelphia Union','Indiana United','Reading','Bahia','Luton Town','Port Vale','Retired','Rotherham United','Brentford','Aston Villa','West Ham','QPR','Leicester City','Preston North End','Louisville City','Colorado Springs','Coventry City','Charleroi','Al Ettifaq','Charleston Battery','Chelsea','Coventry City','Retired','Vancouver Whitecaps'],
  },
  sau: {
    manager: 'Roberto Mancini',
    formation: '4-3-3',
    names: ['Mohammed Al-Owais','Mohammed Al-Rubaie','Nawaf Al-Aqidi','Sultan Al-Ghannam','Ali Al-Bulaihi','Abdulelah Al-Amri','Hassan Tambakti','Saud Abdulhamid','Yasser Al-Shahrani','Abdullah Madu','Mohammed Al-Burayk','Salem Al-Dawsari','Abdulellah Al-Malki','Mohamed Kanno','Nasser Al-Dawsari','Ali Al-Hassan','Sami Al-Najei','Ayman Yahya','Abdullah Al-Hamdan','Saleh Al-Shehri','Firas Al-Buraikan','Abdullah Radif','Haitham Asiri','Abdulrahman Ghareeb','Nawaf Boushal','Rakan Al-Dossary'],
    clubs: ['Al Hilal','Al Shabab','Al Nassr','Al Nassr','Al Hilal','Al Hilal','Al Ahli','Fiorentina','Al Hilal','Al Nassr','Al Hilal','Al Hilal','Al Hilal','Al Hilal','Al Ahli','Al Nassr','Al Nassr','Al Ahli','Al Shabab','Al Hilal','Al Ahli','Al Ahli','Al Ittihad','Al Ahli','Al Hilal','Al Shabab'],
  },
  nor: {
    manager: 'Ståle Solbakken',
    formation: '4-3-3',
    names: ['Ørjan Nyland','Mads Hermansen','Jacob Karlstrøm','Kristoffer Ajer','Leo Østigård','Stefan Strandberg','Stian Gregersen','Birger Meling','Marcus Holmgren Pedersen','Julian Ryerson','Fredrik André Bjørkan','Martin Ødegaard','Sander Berge','Fredrik Aursnes','Morten Thorsby','Patrick Berg','Aron Dønnum','Jens Petter Hauge','Oscar Bobb','Erling Haaland','Alexander Sørloth','Joshua King','Mohamed Elyounoussi','Ola Solbakken','Antonio Nusa','Jørgen Strand Larsen'],
    clubs: ['Sevilla','Leicester City','Club Brugge','Brentford','Napoli','Valerenga','Rennes','Rennes','Sassuolo','Borussia Dortmund','Wolfsburg','Arsenal','Fulham','Benfica','Union Berlin','Bodø/Glimt','Standard Liège','Eintracht Frankfurt','Manchester City','Manchester City','Villarreal','Fenerbahçe','Celtic','Roma','Club Brugge','Celta Vigo'],
  },
  wal: {
    manager: 'Craig Bellamy',
    formation: '4-3-3',
    names: ['Wayne Hennessey','Danny Ward','Adam Davies','Connor Roberts','Chris Mepham','Joe Rodon','Ben Cabango','Neco Williams','Ben Davies','Chris Gunter','Rhys Norrington-Davies','Aaron Ramsey','Joe Allen','Harry Wilson','David Brooks','Sorba Thomas','Joe Morrell','Rubin Colwill','Jordan James','Daniel James','Brennan Johnson','Kieffer Moore','Mark Harris','Nathan Broadhead','Rabbi Matondo','Luke Harris'],
    clubs: ['Nottingham Forest','Leicester City','Sheffield United','Burnley','Bournemouth','Leeds United','Swansea City','Nottingham Forest','Tottenham','AFG','Sheffield United','Cardiff City','Swansea City','Fulham','Bournemouth','Huddersfield Town','Portsmouth','Brighton','Birmingham City','Leeds United','Tottenham','Ipswich Town','Cardiff City','Ipswich Town','Rangers','Fulham'],
  },
  hon: {
    manager: 'Reinaldo Rueda',
    formation: '4-4-2',
    names: ['Luis López','Edrick Menjívar','Rafael Zúniga','Maynor Figueroa','Denil Maldonado','Carlos Meléndez','Wesly Decas','Kevin Álvarez','Andy Najar','Joseph Rosales','Omar Elvir','Alexander López','Bryan Acosta','Deybi Flores','Edwin Rodríguez','Jorge Álvarez','Luis Palma','Kervin Arriaga','Rigoberto Rivas','Alberth Elis','Romell Quioto','Anthony Lozano','Jerry Bengtson','Jonathan Rubio','Brayan Moya','Bryan Róchez'],
    clubs: ['Real España','Motagua','Real España','Houston Dynamo','Pachuca','Olimpia','Marathón','Pachuca','Los Angeles FC','Motagua','Olimpia','Motagua','Nashville SC','Olimpia','Olimpia','Motagua','Celtic','Minnesota United','Reggina','Bordeaux','CF Montréal','Cádiz','Alajuelense','Académica','Zulia','Nacional'],
  },
  tun: {
    manager: 'Jalel Kadri',
    formation: '4-3-3',
    names: ['Aymen Dahmen','Mouez Hassen','Béchir Ben Saïd','Montassar Talbi','Dylan Bronn','Nader Ghandri','Ali Maâloul','Mohamed Dräger','Wajdi Kechrida','Rami Kaib','Ali Abdi','Aïssa Laïdouni','Ellyes Skhiri','Ferjani Sassi','Hannibal Mejbri','Mohamed Ali Ben Romdhane','Ghaylène Chaalali','Naïm Sliti','Saâd Bguir','Youssef Msakni','Seifeddine Jaziri','Wahbi Khazri','Issam Jebali','Naïm Sliti','Anis Ben Slimane','Hamza Rafia'],
    clubs: ['Esperance','Montpellier','US Ben Guerdane','Lorient','Salernitana','Esperance','Al Ahly','Luzern','Montpellier','Étoile du Sahel','Caen','Ferencváros','Eintracht Frankfurt','Al Nassr','Manchester United','Esperance','Esperance','Ettifaq','Esperance','Al Arabi','Zamalek','Montpellier','Odense','Ettifaq','Copenhagen','Juventus Next Gen'],
  },
}

// Rating ranges by position and team tier
const tierByTeam = {
  bra: 1, arg: 1, fra: 1, eng: 1, esp: 1, ger: 1, por: 1,
  ned: 1, bel: 1, ita: 1, cro: 1, uru: 1, usa: 2, mex: 2,
  col: 2, jpn: 2, kor: 2, sen: 2, mar: 2, sui: 2, den: 2,
  pol: 2, swe: 2, tur: 2, aut: 2, ukr: 2, srb: 2, nor: 2,
  cmr: 3, ngr: 3, gha: 3, chi: 3, ecu: 3, can: 3, crc: 3,
  wal: 3, sco: 3, par: 3, irn: 3, alg: 3, civ: 3, per: 3,
  tun: 3, sau: 3, jam: 4, nzl: 4, hon: 4, aus: 3,
}

function ratingRange(tier, position, index) {
  // Starters (first 11-ish) get higher ratings
  const isStarter = index < 11
  const base = {
    1: isStarter ? [80, 93] : [72, 82],
    2: isStarter ? [75, 86] : [68, 78],
    3: isStarter ? [70, 81] : [64, 74],
    4: isStarter ? [65, 76] : [60, 70],
  }
  const [min, max] = base[tier] || base[3]
  // GK slightly lower display, FW slightly higher
  const adj = position === 'FW' ? 1 : position === 'GK' ? -1 : 0
  return Math.floor(Math.random() * (max - min + 1)) + min + adj
}

function randomAge(position, index) {
  if (position === 'GK') return Math.floor(Math.random() * 12) + 24 // 24-35
  if (index > 20) return Math.floor(Math.random() * 6) + 19 // 19-24 young subs
  return Math.floor(Math.random() * 14) + 21 // 21-34
}

function randomCaps(tier, index) {
  const base = index < 11 ? 40 : 10
  const variance = index < 11 ? 80 : 30
  return Math.floor(Math.random() * variance) + base
}

function randomIntlGoals(position, caps) {
  if (position === 'GK') return 0
  if (position === 'DF') return Math.floor(Math.random() * Math.min(caps * 0.05, 5))
  if (position === 'MF') return Math.floor(Math.random() * Math.min(caps * 0.15, 15))
  return Math.floor(Math.random() * Math.min(caps * 0.4, 40)) + 1
}

// Market value in millions (EUR) — rough estimate based on rating & age
function marketValue(rating, age, position) {
  let base = Math.pow((rating - 60) / 30, 2.5) * 80
  // Age curve: peak at 25-28
  if (age < 22) base *= 0.7
  else if (age < 25) base *= 1.1
  else if (age <= 28) base *= 1.0
  else if (age <= 31) base *= 0.7
  else if (age <= 33) base *= 0.4
  else base *= 0.2
  // GK worth less
  if (position === 'GK') base *= 0.5
  return Math.max(0.5, Math.round(base * 10) / 10)
}

// Generate players for all teams
const players = []
let playerId = 1

for (const team of seed.teams) {
  const teamData = teamPlayers[team.id]
  if (!teamData) {
    console.warn(`No player data for team: ${team.id}`)
    continue
  }

  const tier = tierByTeam[team.id] || 3
  const usedNumbers = new Set()

  for (let i = 0; i < 26; i++) {
    const position = positionSlots[i]
    let number
    if (position === 'GK' && i === 0) number = 1
    else if (position === 'GK' && i === 1) number = 12
    else if (position === 'GK' && i === 2) number = 23
    else {
      // Assign realistic squad numbers
      const preferred = position === 'DF' ? [2,3,4,5,6,13,14,15,16,17,24,25,26] :
                        position === 'MF' ? [6,7,8,10,11,14,15,16,17,18,20,22,24,25,26] :
                        [7,9,10,11,17,19,20,21,22,24,25,26]
      const available = preferred.filter(n => !usedNumbers.has(n))
      number = available.length > 0
        ? available[Math.floor(Math.random() * available.length)]
        : Array.from({length: 26}, (_, i) => i + 1).filter(n => !usedNumbers.has(n))[0]
    }
    usedNumbers.add(number)

    const age = randomAge(position, i)
    const caps = randomCaps(tier, i)
    const rating = ratingRange(tier, position, i)
    const intlGoals = randomIntlGoals(position, caps)
    const value = marketValue(rating, age, position)

    players.push({
      id: `p${String(playerId).padStart(4, '0')}`,
      name: teamData.names[i],
      number,
      position,
      teamId: team.id,
      club: teamData.clubs[i],
      age,
      caps,
      internationalGoals: intlGoals,
      fifaRating: rating,
      marketValue: value,
      goals: 0,
      assists: 0,
      yellowCards: 0,
      redCards: 0,
    })
    playerId++
  }
}

// Add players to seed data
seed.players = players

// Add lineups to group stage matches (first 72 matches)
// Each team gets a default starting XI based on the first 11 in the position slots
const teamStartingXI = {}
for (const team of seed.teams) {
  const teamPlayerList = players.filter(p => p.teamId === team.id)
  teamStartingXI[team.id] = {
    starting: teamPlayerList.slice(0, 11).map(p => p.id),
    subs: teamPlayerList.slice(11).map(p => p.id),
  }
}

// Add formation info per team
seed.teamMeta = {}
for (const team of seed.teams) {
  const data = teamPlayers[team.id]
  if (data) {
    seed.teamMeta[team.id] = {
      manager: data.manager,
      formation: data.formation,
    }
  }
}

// Add lineups to all matches that have assigned teams
for (const match of seed.matches) {
  if (match.homeTeamId && match.awayTeamId) {
    match.homeLineup = teamStartingXI[match.homeTeamId] || null
    match.awayLineup = teamStartingXI[match.awayTeamId] || null
  }
}

writeFileSync(seedPath, JSON.stringify(seed, null, 2))
console.log(`Generated ${players.length} players for ${seed.teams.length} teams`)
console.log(`Added lineups to ${seed.matches.filter(m => m.homeLineup).length} matches`)
console.log(`Added team meta (manager + formation) for ${Object.keys(seed.teamMeta).length} teams`)
