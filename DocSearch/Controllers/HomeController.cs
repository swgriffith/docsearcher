using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace DocSearch.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.Title = "Home Page";

            return View();
        }

        public ActionResult Upload()
        {
            ViewBag.Title = "Upload Page";
            ViewBag.Status = "Add a file";
            return View();
        }

        [HttpPost]
        public ActionResult Upload(HttpPostedFileBase[] uploadedFiles)
        {

            if (uploadedFiles != null)
            {
                try
                {
                    List<string> filesUploaded = new List<string>();
                    foreach (HttpPostedFileBase file in uploadedFiles)
                    {
                        UploadBlob(file);
                        filesUploaded.Add(file.FileName);
                    }
                    ViewBag.filesUploaded = filesUploaded;
                }
                catch (Exception ex)
                {
                    ViewBag.Status = ex.Message;
                }
            }
            else
            {
                ViewBag.Status = "No files selected";
            }

            return View("Upload");
        }

        private CloudBlobContainer GetCloudBlobContainer()
        {
            CloudStorageAccount storageAccount = CloudStorageAccount.Parse(ConfigurationManager.AppSettings["StorageAccountConnectionString"]);
            CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();
            CloudBlobContainer container = blobClient.GetContainerReference("documents");
            container.CreateIfNotExists();

            return container;
        }


        public void UploadBlob(HttpPostedFileBase file)
        {

                CloudBlobContainer container = GetCloudBlobContainer();
                CloudBlockBlob blob = container.GetBlockBlobReference(file.FileName);
                blob.UploadFromStream(file.InputStream);

        }

    }
}
