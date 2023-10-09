import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style.css";

const API_BASE_URL = "https://www.reddit.com";
const API_ENDPOINT_SEARCH = "/search.json";

function Home({ user }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [postList, setPostList] = useState([]);
  const [historyUser, setHistoryUser] = useState("");
  const [keywordSearches, setKeywordSearches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);
 

  useEffect(() => {
    if (user) {
      setHistoryUser(user.id);
    }
  }, [user]);

  if (user) {
    const handleSearch = async (keyword) => {
      setIsLoading(true);
      try {
        const created_at = new Date(
          new Date().getTime() + 3 * 60 * 60 * 1000
        ).toISOString(); //UTC + 3
        const keywordSearch = { keyword, created_at };
        setKeywordSearches((keywordSearches) => [
          keywordSearch,
          ...keywordSearches,
        ]);
        const response = await getSearchData(keyword);
        console.log("response from search: ", response);
        setPostList(response);
        setIsLoading(false);
        const keyword_id = await saveKeyword(keyword, user.id);
        await saveKeywordResults(keyword_id, response);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
     };

     async function handleHistorySearch(keyword, created_at) {
      setIsLoading(true);
      try {
        const response = await getKeywordResultsDB(keyword, created_at);
        setPostList(response);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
     }

     if (user) {
      return (
          <>
            <Header
              onSearch={handleSearch}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />

            <main className="main">
              <HistoryList
                historyUser={historyUser}
                keywordSearches={keywordSearches}
                setKeywordSearches={setKeywordSearches}
                handleHistorySearch={handleHistorySearch}
              />
              
        {isLoading ? (
          <Loader />
        ) : (
          <PostList postList={postList} />
        )}
              
            </main>
          </>
        )
      
    // }
  }
}
}

function Header({ onSearch, searchTerm, setSearchTerm }) {
  const appTitle = "Reddit Api App";

  const handleSearch = async () => {
    onSearch(searchTerm);
  };

  return (
    <header className="header">
      <div className="logo">
        <img src="reddit.jpg" height="68" width="68" alt="Reddit Logo" />
        <h1>{appTitle}</h1>
      </div>
      <div className="searchbar-container">
        <div className="wrap">
          <div className="search">
            <input
              type="text"
              className="searchTerm"
              placeholder="What are you looking for?"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={handleSearch} className="searchButton">
              <i className="fa fa-search"></i>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

function HistoryList({ historyUser, keywordSearches, setKeywordSearches, handleHistorySearch }) {
  useEffect(() => {
    
    async function fetchHistory() {
      try {
        const response = await getHistory(historyUser);
        setKeywordSearches(response);
      } catch (error) {
        console.error("Error fetching history:", error);
      }
    }

    fetchHistory();
  }, [historyUser, setKeywordSearches]);

  return (
    <aside>
      <div className="container mt-3">
        <h3>Search History</h3>
        {keywordSearches.map((search) => (
          <History key={search.keyword} search={search} handleHistorySearch={handleHistorySearch}/>
        ))}
      </div>
    </aside>
  );
}

function History({ search, handleHistorySearch }) {
  const dateTimeString = search.created_at;
  const formattedDateTime = formatDateTime(dateTimeString);

  async function getKeyword() {
    try {
    return await handleHistorySearch(search.keyword, search.created_at);
  }
  catch (error) {
    console.error("Error fetching history:", error);
  }
  };

  return (
    <button
      type="button"
      onClick={getKeyword}
      className="btn btn-default btn-large btn-search"
    >
      {search.keyword}{" "}
      <span className="badge bg-light badge-white"> {formattedDateTime}</span>
    </button>
  );
}

function Loader() {
  return <p className='message'>Loading...</p>;
}

async function getHistory(userID) {
  const requestBody = {
    userID: userID,
  };

  try {
    const response = await fetch("http://localhost:4000/getKeywords", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody), // Convert the object to JSON
    });
    const data = await response.json();
    if (response.status === 200) {
      const keywordSearches = data.keywordsData; //ok
      return keywordSearches;
    } else {
      console.log(data.message);
    }
  } catch (error) {
    console.error(error);
  }
}

function PostList({ postList }) {
  return (
    <section>
      {postList.map((post) => (
        <Post key={post.postKey} post={post} />
      ))}
    </section>
  );
}

function Post({ post }) {
  return (
    <li className="fact">
      <div className="post-user">
        <p>👤{post.authorFullname}</p>
        <img src={post.thumbnail}></img>
      </div>
      <p className="post-title">
        {post.title}
        <a
          className="source"
          href={post.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          (Source)
        </a>
      </p>
      <div className="vote-buttons">
        <span>👍 {post.ups}</span>
        <span>🗨️ {post.num_comments}</span>
      </div>
    </li>
  );
}

async function saveKeyword(keyword, id) {
  const keywordObj = { keyword, id };
  try {
    const response = await fetch("http://localhost:4000/insertKeyword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(keywordObj),
    });
    const data = await response.json();
    if (response.status === 200) {
      const keyword_id = data.keyword_id;
      return keyword_id;
    } else {
      console.log(data.message);
    }
  } catch (error) {
    console.error(error);
  }
}

async function saveKeywordResults(keyword, response_result) {
  try {
    const requestBody = {
      keyword: keyword,
      response_result: response_result,
    };

    const response = await fetch("http://localhost:4000/insertKeywordResults", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (response.status === 200) {
      console.log("οκ");
    } else {
      console.log(data.message);
    }
  } catch (error) {
    console.error(error);
  }
}

async function getSearchData(keyword) {
  const ApiURL = `${API_BASE_URL}${API_ENDPOINT_SEARCH}?q=${keyword}&sort=new&limit=100`;

  try {
    const response = await fetch(ApiURL);

    
    if (response.status === 200) {
      const json = await response.json();

      
      console.log("result from API:", )
      const searchResults = json.data.children;
      const resultsArray = [];

     
      searchResults.forEach((result) => {
        const authorFullname = result.data.author_fullname;
        const title = result.data.title;
        const num_comments = result.data.num_comments;
        const ups = result.data.ups;
        const thumbnail = result.data.thumbnail;
        const url = result.data.url;
        const postKey = num_comments+Math.floor(Math.random() * 10000);

      
        if (!["none", "default", "image", "self", "nsfw"].includes(thumbnail)) {
         
          const resultObject = {
            authorFullname,
            title,
            num_comments,
            ups,
            thumbnail,
            url,
            postKey
          };
         
          resultsArray.push(resultObject);
        }
      });

      return resultsArray;
    } else {
      console.log(
        "Request to Reddit API failed with status code:",
        response.status
      );
    }
  } catch (error) {
    console.error(error);
  }
}

async function getKeywordResultsDB(keyword, created_at) {
  const requestBody = {
    keyword: keyword,
    created_at: created_at,
  };

  try {
    const response = await fetch("http://localhost:4000/getKeywordResults", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody), // Convert the object to JSON
    });
    const json = await response.json();
    if (response.status === 200) {
      return(json.keywordRSLTS[0].Keyword_Results);
    } else {
      console.log(json.message);
    }
  } catch (error) {
    console.error(error);
  }
}

function formatDateTime(dateTimeString) {
  const dateParts = dateTimeString.split(/[-T:.]/); // Split the string into date and time parts
  const year = dateParts[0].slice(-2); // Extract the last two digits of the year
  const month = dateParts[1];
  const day = dateParts[2];
  let hours = dateParts[3];
  const minutes = dateParts[4];
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

export default Home;
