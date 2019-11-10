import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Spinner from './spinner.component';
import { Collapse, Tag, Input, Tooltip, Icon } from 'antd';
import '../stylesheets/settings.scss';
import 'antd/dist/antd.css';

const { Panel } = Collapse;

export default function SettingsComponent(props){
    const [state, setState] = useState();
    const [stores, setStores] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [inputVisible, setInputVisible] = useState(false);
    let input;
    useEffect(()=>{
        axios.get('http://localhost:3001/transactions/').then((response) => {
            if(response.status === 200){
               setStores(response.data.stores.stores);
            }
            }).catch(err => {
                console.log(err);
          });
    }, []);

    useEffect(() =>{
        if(input)
            input.focus();
    });
    
    let handleClose = removedTag => {
        const tags = stores.filter(tag => tag !== removedTag);
        axios.delete('http://localhost:3001/stores/', {
            store: removedTag,
        })
        .then((response) =>{
            setStores(response.data.stores);
        })
        .catch((err)=>{
            console.log(err);
        });
      };
    
    let showInput = () => {
        setInputVisible(true);
      };
    
    let handleInputChange = e => {
        setInputValue(e.target.value);
      };
    
    let handleInputConfirm = () => {
        let tags = JSON.parse(JSON.stringify(stores));
        if (inputValue) {
            axios.post('http://localhost:3001/stores/', {
                store: inputValue,
            })
            .then((response) =>{
                setStores(response.data.stores);
            })
            .catch((err)=>{
            });
        }
        
          setStores(tags);
          setInputVisible(false);
          setInputValue('');
      };
      let saveInputRef = inp => (input = inp);
      console.log(stores);
    return(
        <div className="settings-container">
        <Collapse>
            <Panel header="Users" key="1">
                <p>Users</p>
            </Panel>
            <Panel header="Stores" key="2">
            <div>
                    {stores.map((tag, index) => {
                    const isLongTag = tag.length > 20;
                    const tagElem = (
                        <Tag key={tag._id} closable={true} onClose={() => handleClose(tag._id)}>
                        {isLongTag ? `${tag.name.slice(0, 20)}...` : tag.name}
                        </Tag>
                    );
                    return isLongTag ? (
                        <Tooltip title={tag} key={tag}>
                        {tagElem}
                        </Tooltip>
                    ) : (
                        tagElem
                    );
                    })}
                    {inputVisible && (
                    <Input
                        ref={saveInputRef}
                        type="text"
                        size="small"
                        style={{ width: 78 }}
                        value={inputValue}
                        onChange={handleInputChange}
                        onBlur={handleInputConfirm}
                        onPressEnter={handleInputConfirm}
                    />
                    )}
                    {!inputVisible && (
                    <Tag onClick={showInput} style={{ background: '#fff', borderStyle: 'dashed' }}>
                        <Icon type="plus" /> New Tag
                    </Tag>
                    )}
                </div>
            </Panel>
            <Panel header="Categories" key="3">
            <p>Categories</p>
            </Panel>
            <Panel header="Stock Rules" key="4">
            <p>Stock Rules</p>
            </Panel>
            <Panel header="Discount Rules" key="5">
            <p>Discount Rules</p>
            </Panel>
        </Collapse>
        </div>
    )
}