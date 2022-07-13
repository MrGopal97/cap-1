import * as React from "react";
import "./markdown.css";
import { API } from "../../API/API";
import { useState,useEffect } from "react";
import { useHistory } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import toast from "react-hot-toast";

export function MarkDown({inputValue,setInputValue,darkMode,updation,setUpdation}){

    const history = useHistory();

    const innerHeaderStyle = {color:(darkMode)?"black":"rgb(243, 201, 201)"};
    const previewTextColor = (darkMode)?"previewDarkDiv":"previewWhiteDiv";

    const [saved,setSaved] = useState(false);

  useEffect(()=>{
    setSaved(false);
  },[updation]);

  const typing = (e)=>{
    setInputValue(e.target.value);
    
  }

  const saveData=()=>{

       const id = sessionStorage.getItem("id");
       const token = sessionStorage.getItem("token");
       if(id&&token){

        let name =  prompt("file name");
        while(name === "" || name === undefined){
            name = prompt("please enter a valid file name");
        }
        if(name === null){
          return;
        }
           toast.loading("saving your markdown file");
           fetch(`${API}/users`,
           {method:"POST",
            headers:{"Content-Type":"application/json",token,id},
            body:JSON.stringify({name:name,content:inputValue})})
            .then((response)=>{
              toast.remove();
               if(response.status === 400){
                  toast.error("please login again to save your files")
                   sessionStorage.clear();
                   history.push("/loginAndSignUp");
               } 
               else{
                      toast.success("Saved Successfully😎");
                      setSaved(true);
                      setUpdation(true);
               }})
       }else{
        toast.error("please login to save your files😀")
         setSaved(false);
        history.push("/loginAndSignUp");
       }
  };

    return(
        <div className="markdownCoverDiv">
            <header className='header'>
                    <div className='headerDiv'>
                        
                     
                      <h1 className='title'>Markdown Viewer</h1>
                      
                    </div>
                  </header>
                  <main className='main'>
                      
                 
                        <div className='markdownInputOuterDiv'>
                          <div className='markdown_Header_Div'>
                             <h2 style={innerHeaderStyle} className='markdownInputTitle'>Input</h2>
                             <div>
                               {saved
                                ?<button><a href="null" title="succesfully saved" onClick={(e)=>{e.preventDefault()}}>✌️</a></button>
                                :<button><a href="null" title="save online" onClick={(e)=>{e.preventDefault();saveData()}}>💾</a></button>
                                }
                                 
                                 <button><a href="null" title="clear all" onClick={(e)=>{e.preventDefault();setInputValue("")}}>🧹</a></button>
                          
                             </div>
                          </div>
                         
                          <div className='inputInnerDiv'>
                          <textarea className='inputTextArea' 
                                    value={inputValue}
                                    onChange={typing}
                                    placeholder="Play with the markdown here!!">
                 
                          </textarea>
                          </div>
                        </div>
                   
                        <div className='markdownPreviewOuterDiv'>
                          <div className='markdown_Header_Div'>
                             <h2 style={innerHeaderStyle} className='markdownPreviewTitle'>Preview</h2>
                          </div>
             
                          <div className='previewInnerDiv'>
                             <ReactMarkdown children={inputValue} 
                                            className={previewTextColor}
                                           />
                          </div>
                        </div>
                 
                   </main>
                  <footer className='footer'>
                    <div className='footerDiv'>
                      
                         Open Source since {new Date(Date.now()).getFullYear()}💗
                      
                    </div>
                  </footer>
        </div>
    )
}