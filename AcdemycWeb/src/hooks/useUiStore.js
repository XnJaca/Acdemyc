import { useDispatch, useSelector } from "react-redux"
import {
    onOpenDateModal,
    onCloseDateModal, 
} from "../store";

export const useUiStore = () => {

    const dispatch = useDispatch();

    const { isDateModalOpen } = useSelector(state => state.ui); 

    const onOpenModal = () => {
        dispatch(onOpenDateModal())
    };

    const onCloseModal = () => {
        dispatch(onCloseDateModal())
    }; 

    return {
        //*Constantes 
        isDateModalOpen, 

        //*Metodos 
        onCloseModal,
        onOpenModal, 
    };
}