using DocSearch.Models;
using Microsoft.Azure.Search;
using Microsoft.Azure.Search.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace DocSearch.Controllers
{
    public class SearchController : ApiController
    {
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/values/5
        public string Get(int id)
        {
            return "value";
        }

        public IEnumerable<SearchDocument> Get([FromUri]string value)
        {

              string AZURE_SEARCH_SERVICE_NAME = ConfigurationManager.AppSettings["SearchServiceName"];
            string AZURE_SEARCH_ADMIN_KEY = ConfigurationManager.AppSettings["SearchServiceKey"]; 

        List<SearchDocument> docsToReturn = new List<SearchDocument>();

            var parameters = new SearchParameters();

            //List<string> orderby = new List<string>();
            //orderby.Add(sort);
            List<string> highlight = new List<string>();
            highlight.Add("text");

            //parameters.OrderBy = orderby.AsReadOnly();
            parameters.HighlightFields = highlight.AsReadOnly();
            parameters.HighlightPreTag = "<strong>";
            parameters.HighlightPostTag = "</strong>";

            SearchServiceClient serviceClient = new SearchServiceClient(AZURE_SEARCH_SERVICE_NAME, new SearchCredentials(AZURE_SEARCH_ADMIN_KEY));
            ISearchIndexClient indexClient = serviceClient.Indexes.GetClient("docs");
            DocumentSearchResult<SearchDocument> response = indexClient.Documents.Search<SearchDocument>(value, parameters);

            foreach (SearchResult<SearchDocument> result in response.Results)
            {
                
                docsToReturn.Add(result.Document);
                
            }

            return docsToReturn;

        
    }
}
}
